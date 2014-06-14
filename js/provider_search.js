ProviderSearch = {};

// Returns an array of flights originating from an airport
ProviderSearch.flightsWithOrigin = function (code) {
  return Provider.originHash[code.toUpperCase()];
};

// Returns an array of flights destined to an airport
ProviderSearch.flightsWithDestination = function (code) {
  return Provider.destHash[code.toUpperCase()];
};

// Returns an array of flights travelling between an origin and destination
ProviderSearch.flightsBetween = function (originCode, destinationCode) {
  var flights = ProviderSearch.flightsWithOrigin(originCode);
  var matchedFlights = [];
  if (!flights) return;

  // Iterate through a list of flights from the provided origin
  for (var i = flights.length - 1; i >= 0; i--) {

    var flightDestCode = flights[i].get("Destination");
    // Simple comparison to identify flights with matching destination
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
};
