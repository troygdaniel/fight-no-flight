/**
 * Airport Model
 */

var Airport = Backbone.Model.extend({
  
  storeName: "airports",
  database: window.App.database,

});

/**
 * Airports Collection
 */
var Airports = Backbone.Collection.extend({  
  storeName: "airports",
  database: window.App.database,
  model: Airport,  
  initialize: function() { 
  }
});

/**
 * Airports.hasData()
 */
Airports.hasData = function() {
  var all = Airports.all();
  if (all.length > 0) return true;
  if (all.length <= 0) return false;
}

/**
 * Airports.all()
 */
Airports.all = function() {
  if (typeof Airports._all === "undefined") {
    Airports._all = new Airports();
    Airports._all.fetch();
  }
  return Airports._all;
}

/**
 * Airports.count()
 */
Airports.count = function() {
  return Airports.all().length;
}

/**
 * Airports.loadFromCSV()
 */
Airports.loadFromCSV = function () {

  // HTTP GET 'data/airports.txt'
  $.ajax({
    type: "GET",
    url: "data/airports.txt",
    dataType: "text",

    success: function(data) {

      // parse the airports.txt as a csv file
      var airports_csv = $.parse(data,{header: true});
      
      // access the array of objects transformed from the csv
      var rows = airports_csv.results.rows;

      // Create a hash for easy lookup of airports by 'code' and city (i.e. YYZ, Toronto)
      Airports.airportCodeHash = {};
      Airports.airportNameHash = {};

      // iterate through the airport objects and create backbone models
      for (var i = 0; i < rows.length; i++) {
       
        // Create backbone model to represent airport
        var row = rows[i];
        var airport = new Airport(row);

        // Setup the airport hash tables
        Airports.airportCodeHash[row.iata_faa] = airport;
        Airports.airportCodeHash[row.city] = airport;

        // TODO: implement a noBackend solution with IndexedDB (remove the hash tables)
        // airport.save();
      }
    }
 });
}
Airports.count();