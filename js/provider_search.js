ProviderSearch = {};

/*
 * ProviderSearch.flightsWithOrigin(code)
 */
ProviderSearch.flightsWithOrigin = function (code) {
  return Provider.originHash[code.toUpperCase()];
}

/*
 * ProviderSearch.flightsWithDestination(code)
 */
ProviderSearch.flightsWithDestination = function (code) {
  return Provider.destHash[code.toUpperCase()];
}

/*
 * ProviderSearch.flightsWithDestination(code)
 */
ProviderSearch.flightsBetween = function (originCode, destinationCode) {
  var flights = ProviderSearch.flightsWithOrigin(originCode);
  var matchedFlights = [];
  if (!flights) return;

  for (var i = flights.length - 1; i >= 0; i--) {
    var flightDestCode = flights[i].get("Destination");

    if (destinationCode === flightDestCode) {
      matchedFlights.push(flights[i]);
    }
  }
  return matchedFlights.sort(
    firstBy(function (a,b) {
      if (a.getPrice() < b.getPrice()) return -1;
      if (a.getPrice() > b.getPrice()) return 1;
      return 0;
    }).
    thenBy(function (a,b){
      if (a.departureEpoc() < b.departureEpoc()) return -1;
      if (a.departureEpoc() > b.departureEpoc()) return 1;
      return 0;
    })
    );
}
