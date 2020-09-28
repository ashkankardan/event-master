var city = document.querySelector('#city')
var country = document.querySelector('#country')
var eventBox = document.querySelector('#eventBox')
var searchMenu = document.querySelector("#searchLocation");
var searchBtn = document.querySelector("#searchBtn");
var currentMenu = document.querySelector("#currentLocation");
var countryList = document.querySelector(".countryList");
var countryTextInput = document.querySelector(".countryTextInput");
var countryDropdownInput = document.querySelector(".countryDropdownInput");
var posLat = null;
var posLog = null;

currentPage();

currentMenu.addEventListener("click", currentPage);
searchMenu.addEventListener("click", searchPage);

function getCoords() {
  var geo = navigator.geolocation;
  geo.getCurrentPosition(coordsSuccess, coordsError);

}
function coordsSuccess(pos) {
  posLat = pos.coords.latitude;
  posLog = pos.coords.longitude;
  getLocName(posLat, posLog);
}

function coordsError(err) {
  console.log(err);
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
      },
    });
}


function successLocation(data) {
  var countryCode = "";
  var cityVal = "";
  city.value = data.results[0].components.province;
  country.value = data.results[0].components.country;
  cityVal = data.results[0].components.province;
  countryCode = data.results[0].components["ISO_3166-1_alpha-2"];

  var eventUrl =
    `https://app.ticketmaster.com/discovery/v2/events.json?city=` +
    cityVal +
    `&countryCode=` +
    countryCode +
    `&apikey=vOGcYQeN6gsCpcpVpqGgoVBD3VtifhHM`;

  console.log(eventUrl)
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
    },
  });
}

function successEventData(data) {
  eventBox.textContent = "";
  if (data.page.totalElements < 1) {
    var noEventText = document.createElement("h3");
    noEventText.textContent =
      "No event data available for this location! Please try searching for a different location";
    eventBox.append(noEventText);
  } else {
    displayEvents(data);
  }
}

function displayEvents(data) {
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

    var evDateTime = data._embedded.events[i].dates.start.dateTime.split("T");
    var evDate = document.createElement("p");
    evDate.textContent = evDateTime[0] + " at " + evDateTime[1].slice(0, 5);

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
  searchBtn.textContent = "AUTO-LOCATE!";
  searchBtn.setAttribute("disabled", "");

  eventBox.textContent = "Please wait!";
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
  searchMenu.classList.add("selected");
  currentMenu.classList.remove("selected");

  searchBtn.textContent = "SEARCH!";
  searchBtn.removeAttribute("disabled", "");

  var cityInputBox = document.createElement("input");
  cityInputBox.setAttribute("id", "cityInput");
  city.append(cityInputBox);

  getCountryList();

  var newSearchText = document.createElement("h3");
  newSearchText.textContent = "Please search for a city/country name!";
  eventBox.append(newSearchText);

  searchBtn.addEventListener("click", searchEvents);
}

function searchEvents() {
  var apiUrl =
    `https://app.ticketmaster.com/discovery/v2/events.json?city=` +
    city.value +
    `&countryCode=` +
    countryList.value +
    `&apikey=vOGcYQeN6gsCpcpVpqGgoVBD3VtifhHM`;

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
