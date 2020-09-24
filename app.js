

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
  for(var i = 0; i < 1; i++) {
    var evImg = document.createElement('div')
    evImg.className = "evImg"
    evImg.style.backgroundImage = data._embedded.events[0].images[0].url;



  }
}
