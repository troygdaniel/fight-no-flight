/**
 * Airport Model
 */

var Airport = Backbone.Model.extend({  
  // storeCity: "airport",
  // database: window.App.database,
});
Airport.DATA_URL = "data/airports.txt";
Airport.ASYNC_MODE = true;
Airport.airportCodeHash = {};
Airport.airportCityHash = {};
Airport._all = [];

/**
 * Airport.hasData()
 */

Airport.hasData = function() {
  var all = Airport.all();
  if (all.length > 0) return true;
  if (all.length <= 0) return false;
}

/**
 * Airport.all()
 */
Airport.all = function() {
  if (Airport._all === []) {
    Airport.loadFromCSV();
  }
  return Airport._all;
}

/**
 * Airport.count()
 */
Airport.count = function() {
  return Airport.all().length;
}

/**
 * Airport.fetchAirportByCode()
 */
Airport.fetchAirportByCode = function (code, callback) {
  if (!callback) {
      throw new Error("Airport.fetchAirportByCode: Missing required second param 'callback'");
  }

  if (Airport.count() === 0 ) {
    Airport.loadFromCSV(function() {
      callback(Airport.airportCodeHash[code]);
    });
  } else {
    callback(Airport.airportCodeHash[code]);
  } 
}

/**
 * Airport.fetchAirportByCode()
 */
Airport.fetchAirportsByCity = function(city, callback) {
  if (!callback ) {
      throw new Error("Airport.fetchAirportsByCity: Missing required second param 'callback'");
  }

  if (Airport.count() === 0 ) {
    Airport.loadFromCSV(function() {    
      callback(Airport.airportCityHash[city]);
    });
  } else {    
    callback(Airport.airportCityHash[city]);
  }   
}

/**
 * Airport.setupData()
 */
Airport.setupData = function(rows) {
  // iterate through the airport objects and create backbone models
  for (var i = 0; i < rows.length; i++) {       
    var row = rows[i];

    // Create backbone model to represent airport
    var airport = new Airport(row);
    var codeHash = Airport.airportCodeHash;
    var cityHash = Airport.airportCityHash;
    
    Airport._all.push(airport);

    // Setup the airport hash tables
    codeHash[row.iata_faa] = airport;
    if (!cityHash[row.city]) {
      cityHash[row.city] = [airport]; 
    } else {
      cityHash[row.city].push(airport);
    }

    // TODO: implement a noBackend solution with IndexedDB (remove the hash tables)
    // airport.save();
  }
}
/**
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
      Airport._all = [];

      // parse the airport.txt as a csv file
      var airport_csv = $.parse(data,{header: true});
      Airport.setupData(airport_csv.results.rows);

      if (callback) callback();
    }
 });
}