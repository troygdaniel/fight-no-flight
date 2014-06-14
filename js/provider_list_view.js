var ProviderListView = Backbone.View.extend({
  
  flightsBetween: function(origin, dest) {
    var response = "Searching for flights from '"+origin+"' to '"+dest+"'<br/>";

    if (!origin || !dest)
      return    "Missing required arguments:<BR>"
              + "-o   Origin Airport Code<BR>"
              + "-d   Destination Airport Code<br/><br/>"
              + "Example usage:<br/>$ searchFlights -o LAS -d LAX<br/>";

    var flights = Provider.flightsBetween(origin, dest);

    for (var i = 0; i <= flights.length - 1; i++) {
      response  += this.cliFlightRow(flights[i]);
    }
    return response;
  },
  cliFlightRow: function(flight) {
      var cliTemplate = "##Origin --> ##Destination (##Departure Time --> ##Destination Time) - ##FlightTime - ##FlightPrice";
      cliTemplate = cliTemplate.replace("##Origin",flight.get("Origin"));
      cliTemplate = cliTemplate.replace("##Destination",flight.get("Destination"));
      cliTemplate = cliTemplate.replace("##Departure Time",flight.formattedOriginTime());
      cliTemplate = cliTemplate.replace("##Destination Time",flight.formattedDestinationTime());
      cliTemplate = cliTemplate.replace("##FlightTime",flight.flightTime());
      cliTemplate = cliTemplate.replace("##FlightPrice",flight.get("Price"));
      return cliTemplate + "<br>";
  }
});