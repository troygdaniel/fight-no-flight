/*
 * Airport Backbone Model
 */
var Airport = Backbone.Model.extend({  
  /*  
   *  timezoneOffset()
   *  Return the airport's time zone, with DST conversion
   */  
  timezoneOffset: function() {
    var tz = this.get("timezone");
    if (Date.isNowDst()) {
      tz++;
    }
    return tz +":00";
  },
  /*  
   *  sync()
   *  Over-ride the backbone save() method
   */
  sync: function(method, model, options) {
      options || (options = {});

      if (method === "create") {
        Airport.all.push(this);
      }
              
      if (options.url)
        return Backbone.sync.call(model, method, model, options);
  }
});

// Configure the data source
Airport.DATA_URL = "data/airports.txt";
// Allow async/sync config - mostly for tests
Airport.ASYNC_MODE = true;

// fast lookup by code
Airport.airportCodeHash = {};
// fast lookup by city
Airport.airportCityHash = {};
// the entire dataset of airports
Airport.all = [];


// -------------
// Class methods 
// -------------


/*
 * Airport.hasData()
 * Check to see if there is any data loaded
 */
Airport.hasData = function() {
  if (Airport.all.length > 0) 
    return true;
  else
    return false;
};

/*
 * Return the number of airports currenly loaded
 */
Airport.count = function() {
  return Airport.all.length;
};

/* 
 * Airport.fetchAirportByCode()
 * Fetch an airport model given a code  
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
};

/* 
 * Airport.withCode()
 * Return an airport model given a code  
 * WARNING: Assumes that loadFromCSV has returned from async call
 */
Airport.withCode = function(code) {
  if (typeof code === "undefined") return;
  return Airport.airportCodeHash[code.toUpperCase()];
};

/* 
 * Airport.fetchAirportsByCity()
 * Fetch an airport model given a city
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
};

/* 
 * Airport.storeCSVRows()
 * Iterate and store csv rows as backbone models
 */
Airport.storeCSVRows = function(csvRows) {
  // iterate through the airport objects and create backbone models
  for (var i = 0; i < csvRows.length; i++) {       
    var csvRow = csvRows[i];

    // Create backbone model to represent airport and add it to the global array
    var airport = new Airport(csvRow);
    Airport.store(airport, csvRow);
  }
};

/* 
 * Airport.store()
 * Save the backbone models, and create fast lookup hash tables
 */
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
};

/*
 * Airport.loadFromCSV()
 * Load a CSV and store its contents as backbone models
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
};