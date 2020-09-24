

$.ajax({
  url: 'http://ip-api.com/json/',
  method: "GET",
  success: successLocation,
  error: function(error) {
    console.log(error)
  }
})

function successLocation(data) {
  var countryCode = "";
  var cityVal = "";
  console.log(data)
  city.textContent = data.city;
  country.textContent = data.country;
  // cityVal = data.city
  // countryCode = data.countryCode;
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
