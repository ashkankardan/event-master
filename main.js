var city = document.querySelector('#city')
var country = document.querySelector('#country')
var state = document.querySelector('#state')
var stateListVal = ""
var eventBox = document.querySelector('#eventBox')
var searchMenu = document.querySelector("#searchLocation");
var searchBtn = document.querySelector("#searchBtn");
var currentMenu = document.querySelector("#currentLocation");
var countryList = document.querySelector(".countryList");
var stateList = document.querySelector(".stateList");
var countryTextInput = document.querySelector(".countryTextInput");
var countryDropdownInput = document.querySelector(".countryDropdownInput");
var stateTextInput = document.querySelector(".stateTextInput");
var stateDropdownInput = document.querySelector(".stateDropdownInput");
var posLat = null;
var posLog = null;

var tempdata = null

currentPage();

currentMenu.addEventListener("click", currentPage);
searchMenu.addEventListener("click", searchPage);

function getCoords() {
  var spinner = document.createElement('div')
  spinner.className = 'spinner'
  eventBox.append(spinner)
  var geo = navigator.geolocation;
  geo.getCurrentPosition(coordsSuccess, coordsError);

}
function coordsSuccess(pos) {
  posLat = pos.coords.latitude;
  posLog = pos.coords.longitude;
  getLocName(posLat, posLog);
}

function coordsError(err) {
  if(err.code = 1) {
    eventBox.textContent = "";
    var noEventText = document.createElement("h3");
    noEventText.textContent =
      "Geolocation Permission Denied! Please search for a location manually";
    eventBox.append(noEventText);
  }
}

function getLocName(posLat, posLog) {
    $.ajax({
      url:
        `https://api.opencagedata.com/geocode/v1/json?q=` +
        posLat +
        `+` +
        posLog +
        `&key=1256ef0d57484e4cb43ec7d801fa5367`,
      method: "GET",
      success: successLocation,
      error: function (err) {
        console.error(err);
        displayFailedRequest();
      },
    });
}


function successLocation(data) {
  var countryCode = "";
  var stateCode = "";
  var cityVal = "";
  country.value = data.results[0].components.country;
  countryCode = data.results[0].components["ISO_3166-1_alpha-2"];

  if(countryCode === "US") {
    state.value = data.results[0].components.state;
    stateCode = data.results[0].components.state_code;
  } else {
    state.value = data.results[0].components.state;
    stateCode = "";
  }

  if (data.results[0].components.province) {
    cityVal = data.results[0].components.province;
    city.value = data.results[0].components.province;
  } else if(data.results[0].components.city) {
    city.value = data.results[0].components.city
    cityVal = data.results[0].components.city
  } else {
    city.value = data.results[0].components.town
    cityVal = data.results[0].components.town
  }



  var eventUrl =
    `https://app.ticketmaster.com/discovery/v2/events.json?city=` +
    cityVal +
    `&stateCode=` +
    stateCode +
    `&countryCode=` +
    countryCode +
    `&apikey=vOGcYQeN6gsCpcpVpqGgoVBD3VtifhHM`;
  getEventData(eventUrl);
}

function getEventData(eventUrl) {
  $.ajax({
    type: "GET",
    url: eventUrl,
    async: true,
    dataType: "json",
    success: successEventData,
    error: function (xhr, status, err) {
      console.error(xhr, status, err);
      displayFailedRequest();
    },
  });
}

function successEventData(data) {
  eventBox.textContent = "";
  if (data.page.totalElements < 1) {
    eventBox.classList.add("white-bg")
    var noEventText = document.createElement("h3");
    noEventText.textContent =
      "No event data available for this location! Please try searching for a different location";
    eventBox.append(noEventText);
  } else {
    displayEvents(data);
  }
}

function displayEvents(data) {
  eventBox.classList.remove("white-bg");
  for (var i = 0; i < data._embedded.events.length; i++) {
    var evItemCol = document.createElement("div");
    evItemCol.className = "row evItem";

    var evDetail = document.createElement("div");
    evDetail.className = "col evDetail";

    var evImg = document.createElement("div");
    evImg.className = "col evImg";
    evImg.style.backgroundImage =
      `url(` + data._embedded.events[i].images[0].url + `)`;

    var evPerformer = document.createElement("p");
    evPerformer.textContent = data._embedded.events[i].name;

    var evGenre = document.createElement("p");
    evGenre.textContent =
      data._embedded.events[i].classifications[0].genre.name;

    var evPrice = document.createElement("p");

    if (data._embedded.events[i].priceRanges) {
      evPrice.textContent =
        data._embedded.events[i].priceRanges[0].min +
        " - " +
        data._embedded.events[i].priceRanges[0].min +
        " " +
        data._embedded.events[i].priceRanges[0].currency;
    } else {
      evPrice.textContent = "Price info not available!";
    }

    if (data._embedded.events[i].dates.start.dateTime) {
      var evDateTime = (data._embedded.events[i].dates.start.dateTime.split("T"))[1].slice(0, 5);
      var evDateDate = (data._embedded.events[i].dates.start.dateTime.split("T"))[0]
    } else {
      var evDateTime = "00:00"
      var evDateDate = data._embedded.events[i].dates.start.localDate
    }
    var evDate = document.createElement("p");
    evDate.textContent = evDateDate + " at " + evDateTime;

    var evLocation = document.createElement("p");
    evLocation.textContent = data._embedded.events[i]._embedded.venues[0].name;

    var bottomBreakLine = document.createElement("div");
    bottomBreakLine.className = "col-12 bottomBreakLine";

    evDetail.append(evPerformer, evGenre, evPrice, evDate, evLocation);
    evItemCol.append(evImg, evDetail);
    eventBox.append(evItemCol, bottomBreakLine);
  }
}

function currentPage() {
  searchMenu.classList.remove("selected");
  currentMenu.classList.add("selected");
  countryTextInput.classList.remove("d-none");
  countryDropdownInput.classList.add("d-none");
  stateTextInput.classList.remove("d-none");
  stateDropdownInput.classList.add("d-none");
  searchBtn.textContent = "AUTO-LOCATE!";
  searchBtn.setAttribute("disabled", "");
  eventBox.textContent = "";
  eventBox.classList.add("white-bg");
  city.value = "";
  country.value = "";
  getCoords();
}

function searchPage() {
  eventBox.textContent = "";
  city.value = "";
  countryList.value = "";
  countryTextInput.classList.add("d-none");
  countryDropdownInput.classList.remove("d-none");
  stateTextInput.classList.add("d-none");
  stateDropdownInput.classList.remove("d-none");
  searchMenu.classList.add("selected");
  currentMenu.classList.remove("selected");

  searchBtn.textContent = "SEARCH!";
  searchBtn.removeAttribute("disabled", "");

  getCountryList();
  createStateOption()

  var cityInputBox = document.createElement("input");
  cityInputBox.setAttribute("id", "cityInput");
  city.append(cityInputBox);


  var newSearchText = document.createElement("h3");
  newSearchText.textContent = "Please search for a city/country name!";
  eventBox.append(newSearchText);

  stateList.addEventListener("change", ()=>{
    stateListVal = stateList.value
  })

  countryList.addEventListener("change", ()=>{
    if(countryList.value !== "US") {
      stateList.setAttribute("disabled", "")
      stateListVal = ""
    } else {
      stateList.removeAttribute("disabled", "")
    }
  })



  searchBtn.addEventListener("click", searchEvents);
}

function searchEvents() {
  var apiUrl =
    `https://app.ticketmaster.com/discovery/v2/events.json?city=` +
    city.value +
    `&stateCode=` +
    stateListVal +
    `&countryCode=` +
    countryList.value +
    `&apikey=vOGcYQeN6gsCpcpVpqGgoVBD3VtifhHM`;

  console.log(apiUrl)
  getEventData(apiUrl);
}

function getCountryList() {
  $.ajax({
    url: "https://restcountries.eu/rest/v2",
    method: "GET",
    success: function (data) {
      createCountryOption(data);
    },
    error: function (err) {
      console.error(err);
      displayFailedRequest()
    },
  });
}

function createCountryOption(list) {
  for (var i = 0; i < list.length; i++) {
    var conuntryOption = document.createElement("option");
    conuntryOption.setAttribute("value", list[i].alpha2Code);
    conuntryOption.textContent = list[i].name;
    countryList.append(conuntryOption);
  }
}

function createStateOption() {
  var stateNamesList = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];
  var stateCodesList = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

  for(var i = 0; i < stateCodesList.length; i++) {
    var stateCodeOption = document.createElement('option')
    stateCodeOption.setAttribute("value", stateCodesList[i])
    stateCodeOption.textContent = stateNamesList[i]
    stateList.append(stateCodeOption)
  }


};




function displayFailedRequest(){
  eventBox.textContent = "";
  eventBox.classList.add("white-bg")
  var failedText = document.createElement("h3");
  failedText.textContent =
      `Request failed! Please try again.`;
    eventBox.append(failedText);
}
