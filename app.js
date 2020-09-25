
currentPage();

function getLocationIP() {
  $.ajax({
    url: 'http://ip-api.com/json/',
    method: "GET",
    success: successLocation,
    error: function(error) {
      console.log(error)
    }
  })
}

function successLocation(data) {
  var countryCode = "";
  var cityVal = "";
  console.log(data)
  city.value = data.city;
  country.value = data.country;
  cityVal = data.city
  countryCode = data.countryCode;
  console.log(typeof countryCode);

  var apiUrl =
    `https://app.ticketmaster.com/discovery/v2/events.json?city=` +
    cityVal +
    `&countryCode=` +
    countryCode +
    `&apikey=vOGcYQeN6gsCpcpVpqGgoVBD3VtifhHM`;

    getEventData(apiUrl);

}

function getEventData(apiUrl) {
  console.log(apiUrl)
  $.ajax({
    type: "GET",
    url: apiUrl,
    async: true,
    dataType: "json",
    success: successEventData,
    error: function (xhr, status, err) {
      console.log(xhr, status, err);
    },
  });
}

var eventData = ""

function successEventData(data) {
  eventBox.textContent = ""
  console.log(data)
  eventData = data;
  if (data.page.totalElements < 1) {
    var noEventText = document.createElement("h3");
    noEventText.textContent =
      "No event data available for this location! Please try searching for a different location";
    eventBox.append(noEventText);
    console.log("no event");
  } else {
    displayEvents(data);
    console.log('some event')

  }
}


function displayEvents(data) {
  for(var i = 0; i < 2; i++) {

    var evDetail = document.createElement('div')

    var evImg = document.createElement('div')
    evImg.className = "evImg"
    evImg.style.backgroundImage =
      `url(` + data._embedded.events[i].images[0].url + `)`;

    var evPerformer = document.createElement('p')
    evPerformer.textContent = data._embedded.events[i].name

    var evGenre = document.createElement("p");
    evGenre.textContent =
      data._embedded.events[i].classifications[0].genre.name;

    var evPrice = document.createElement('p')
    evPrice.textContent = data._embedded.events[i].priceRanges[0].min, data._embedded.events[i].priceRanges[0].min, data._embedded.events[i].priceRanges[0].currency

    var evDateTime = data._embedded.events[i].dates.start.dateTime.split("T");
    var evDate = document.createElement('p');
    evDate.textContent = evDateTime[0] + " at " + evDateTime[1].slice(0, 5);

    var evLocation = document.createElement('p')
    evLocation.textContent = data._embedded.events[i]._embedded.venues[0].name;

    evDetail.append(evPerformer, evGenre, evPrice, evDate, evLocation);
    eventBox.append(evImg, evDetail)
  }
}


currentMenu.addEventListener("click", currentPage);
searchMenu.addEventListener('click', searchPage)


function currentPage(){
  searchMenu.classList.remove("selected");
  currentMenu.classList.add("selected");
  countryTextInput.classList.remove("d-none");
  countryDropdownInput.classList.add("d-none");
  searchBtn.textContent = "AUTO-LOCATE!"
  searchBtn.setAttribute("disabled", "");


  city.value = ""
  country.value = ""
  getLocationIP();

}


function searchPage(){
  eventBox.textContent = "";
  city.value = "";
  countryList.value = "";
  countryTextInput.classList.add("d-none");
  countryDropdownInput.classList.remove("d-none");
  searchMenu.classList.add("selected");
  currentMenu.classList.remove("selected");

  searchBtn.textContent = "SEARCH!";
  searchBtn.removeAttribute("disabled", "");

  var cityInputBox = document.createElement('input')
  cityInputBox.setAttribute("id", "cityInput");
  city.append(cityInputBox)


  getCountryList();

  var newSearchText = document.createElement("h3");
  newSearchText.textContent = "Please search for a city/country name!";
  eventBox.append(newSearchText);

  searchBtn.addEventListener('click', searchEvents);



}


function searchEvents() {
  // var country = document.querySelector("#countrySelect");
  // var cityInput = document.querySelector("#cityInput");


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
      // console.log(data);
      createCountryOption(data);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function createCountryOption(list) {

  for(var i = 0; i < list.length; i++) {
    var conuntryOption = document.createElement("option");
    conuntryOption.setAttribute("value", list[i].alpha2Code);
    conuntryOption.textContent = list[i].name;
    countryList.append(conuntryOption)
  }
  // country.append(countryList)
}
