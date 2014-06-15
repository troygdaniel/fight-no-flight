/*
 *  ProviderListView Backbone view 
 */
var ProviderListView = Backbone.View.extend({
  el: "#flight-search-panel",
  events: {
    "click #search-btn":  "searchButtonAction",
    "keyup #origin-code":  "searchButtonAction",
    "keyup #dest-code":  "searchButtonAction"
  },
  searchButtonAction: function() {
    var originCode = $("#origin-code").val().toUpperCase();
    var destCode = $("#dest-code").val().toUpperCase();
    var flights = this.flightsBetween(originCode, destCode);

    this.showAirportInformation(originCode, destCode);
    
    // Clear previous search results
    $(".search-result-row").remove()
    $("#search-results").addClass("hidden");
    
    // Exit method if no flights found
    if (!flights) return;

    // Iterate through flights and display in table
    for (var i = 0; i <= flights.length - 1; i++) {
      var $newFlightRow = this.tableRowForFlight(flights[i]);
      $("#flight-result-rows").append($newFlightRow);
    }
    // Reveal results greater than 0
    if (flights.length > 0)
      $("#search-results").removeClass("hidden");
  },
  showAirportInformation: function(originCode, destCode) {
    if (originCode.length < 3) return;
    var originAirport = Airport.withCode(originCode);
    if (originAirport) $("#origin-code-airport").html(originAirport.humanReadable());
    
    if (destCode.length < 3) return;
    var destAirport = Airport.withCode(destCode);
    if (destAirport) $("#dest-code-airport").html(destAirport.humanReadable());
  },
  /*
   *  flightsBetween()
   */
  flightsBetween: function(originCode, destCode) {
    if(originCode && !destCode)
      return ProviderSearch.flightsWithOrigin(originCode);
    if(destCode && !originCode)
      return ProviderSearch.flightsWithDestination(destCode);
    
    return ProviderSearch.flightsBetween(originCode, destCode);
  },
  tableRowForFlight: function(flight) {
    var $template = $("#template_row");
    var $newFlightRow = $template.clone();

    $newFlightRow.attr("id",flight.getKey());
    $newFlightRow.addClass("search-result-row");

    $newFlightRow.find(".origin_column").html(flight.get("Origin"));
    $newFlightRow.find(".dest_column").html(flight.get("Destination"));
    $newFlightRow.find(".depart_time_column").html(flight.get("Departure Time"));
    $newFlightRow.find(".dest_time_column").html(flight.get("Destination Time"));
    $newFlightRow.find(".duration_column").html(flight.flightDuration());
    $newFlightRow.find(".price_column").html(flight.get("Price"));
    $newFlightRow.removeClass("hidden");
    
    return $newFlightRow;
  },
  /*
   *  cliFlightsBetween()
   */
  cliFlightsBetween: function(origin, dest) {
    origin = origin.toUpperCase();
    dest = dest.toUpperCase();
    var response = "Searching for flights from '"+origin+"' to '"+dest+"'<br/>";

    if (!origin || !dest)
      return    "Missing required arguments:<BR>" + 
                "-o   Origin Airport Code<BR>" +
                "-d   Destination Airport Code<br/><br/>" +
                "Example usage:<br/>$ searchFlights -o LAS -d LAX<br/>";

    var flights = ProviderSearch.flightsBetween(origin, dest);
    if (!flights || flights.length===0) {
      return "No matches found.";
    }
    for (var i = 0; i <= flights.length - 1; i++) {
      response  += this.cliFlightRow(flights[i]);
    }
    return response;
  },
  /*
   *  cliFlightRow()
   */
  cliFlightRow: function(flight) {
      var cliTemplate = "##Origin --> ##Destination (##Departure Time --> ##Destination Time) - ##FlightDuration - ##FlightPrice";
      cliTemplate = cliTemplate.replace("##Origin",flight.get("Origin"));
      cliTemplate = cliTemplate.replace("##Destination",flight.get("Destination"));
      cliTemplate = cliTemplate.replace("##Departure Time",flight.formattedOriginTime());
      cliTemplate = cliTemplate.replace("##Destination Time",flight.formattedDestinationTime());
      cliTemplate = cliTemplate.replace("##FlightDuration",flight.flightDuration());
      cliTemplate = cliTemplate.replace("##FlightPrice",flight.get("Price"));
      return cliTemplate + "<br>";
  }
});