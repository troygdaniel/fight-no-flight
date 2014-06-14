/*
 * Airport Backbone Model
 */
var Airport = Backbone.Model.extend({  
  timezoneOffset: function() {
    var tz = this.get("timezone");
    if (Date.isNowDst()) {
      tz++;
    }
    return tz +":00";
  }
});

Airport.DATA_URL = "data/airports.txt";
Airport.ASYNC_MODE = true;
Airport.airportCodeHash = {};
Airport.airportCityHash = {};
Airport.all = [];

// --------------------
// Class methods below
// --------------------

/*
 * Airport.hasData()
 */
Airport.hasData = function() {
  if (Airport.all.length > 0) 
    return true;
  else
    return false;
}

/*
 * Airport.count()
 */
Airport.count = function() {
  return Airport.all.length;
}

/*
 * Airport.fetchAirportByCode()
 */
Airport.fetchAirportByCode = function (code, callback) {
  
  //  Callback is required, as the fetch is async
  if (!callback) {
      throw new Error("Airport.fetchAirportByCode: Missing required second param 'callback'");
  }

  // Do we need to first fetch all airports?
  if (Airport.count() === 0 ) {

    // Async GET the CSV
    Airport.loadFromCSV(function() {
      // Execute callback and provide airport for the given code
      callback(Airport.airportCodeHash[code]);
    });
  } else {
    // Execute callback and provide airport for the given code
    callback(Airport.airportCodeHash[code]);
  } 
}

/*
 * Airport.withCode()
 * 
 * WARNING: Assumes that loadFromCSV has returned from async call
 */
Airport.withCode = function(code) {
  if (typeof code === "undefined") return;
  return Airport.airportCodeHash[code.toUpperCase()];
}
/*
 * Airport.fetchAirportsByCity()
 */
Airport.fetchAirportsByCity = function(city, callback) {
  
  //  Callback is required, as the fetch is async
  if (!callback ) {
      throw new Error("Airport.fetchAirportsByCity: Missing required second param 'callback'");
  }

    // Async GET the CSV
  if (Airport.count() === 0 ) {
    Airport.loadFromCSV(function() {    
      // Execute callback and provide airport for the given city
      callback(Airport.airportCityHash[city]);
    });
  } else {    
    // Execute callback and provide airport for the given city
    callback(Airport.airportCityHash[city]);
  }   
}

/*
 * Airport.storeCSVRows()
 */
Airport.storeCSVRows = function(csvRows) {
  // iterate through the airport objects and create backbone models
  for (var i = 0; i < csvRows.length; i++) {       
    var csvRow = csvRows[i];

    // Create backbone model to represent airport and add it to the global array
    var airport = new Airport(csvRow);
    Airport.store(airport, csvRow);
  }
}

Airport.store = function (airport, csvRow) {
    Airport.all.push(airport);

  // Setup the airport hash tables
  Airport.airportCodeHash[csvRow.iata_faa] = airport;
  
  // Does this airport exist in the city hash lookup?
  if (!Airport.airportCityHash[csvRow.city]) {
    // NO - create a new array
    Airport.airportCityHash[csvRow.city] = [airport]; 
  } else {
    // YES - add to the existing array
    Airport.airportCityHash[csvRow.city].push(airport);
  }
}

/*
 * Airport.loadFromCSV()
 */
Airport.loadFromCSV = function (callback) {

  // HTTP GET 'data/airport.txt'  
  $.ajax({
    type: "GET",
    url: Airport.DATA_URL,
    async: Airport.ASYNC_MODE,
    dataType: "text",
    success: function(data) {
      Airport.all = [];

      // parse the airport.txt as a csv file
      var airport_csv = $.parse(data,{header: true});
      Airport.storeCSVRows(airport_csv.results.rows);
      if (callback) callback();
    }
 });
}