/*
 * Provider Backbone Model
 */
var Provider = Backbone.Model.extend({  
  getPrice: function() {
    var _price = this.get("Price");
    if (_price.indexOf("$")===0)
      return parseFloat(_price.substring(1,_price.length));
    else
      return parseFloat(_price);
  },
  getOrigin: function() {
    return this.get("Origin");
  },
  getDestination: function() {
    return this.get("Destination");
  },
  departureTime: function () {
    return this.get("Departure Time").replace(/\-/g,'/');
  },
  destinationTime: function () {
    return this.get("Destination Time").replace(/\-/g,'/');
  },
  departureEpoc: function() { 
    return moment(this.departureTime()).utc().valueOf();
  },
  destinationEpoc: function() { 
    return moment(this.destinationTime()).utc().valueOf();
  },
  formattedTime: function(momentDate) {
    return momentDate.format("MM/DD/YYYY HH:mm:ss");
  },
  formattedOriginTime: function () {
    return this.formattedTime(this.getOriginTime(true));
  },
  formattedDestinationTime: function () {
    return this.formattedTime(this.getDestinationTime(true));
  },
  /*
   * getOriginTime()
   */
  getOriginTime: function (asLocalTime) {
    var airportCode = this.getOrigin();
    var originAirport = Airport.withCode(airportCode);
    var tz = originAirport.get("timezone");
    var dateAsString = ""+this.departureTime();

    if (!asLocalTime)
       dateAsString += " " + Airport.withCode(airportCode).timezoneOffset();

    return moment(dateAsString);
  },
  /*
   * getDestinationTime()
   */
  getDestinationTime: function (asLocalTime) {
    var airportCode = this.getDestination();
    var destAirport = Airport.withCode(airportCode);
    var tz = destAirport.get("timezone");
    var dateAsString = ""+this.destinationTime();

    if (!asLocalTime)
       dateAsString += " " + Airport.withCode(airportCode).timezoneOffset();

    return moment(dateAsString);
  },
  /*
   * flightTime()
   */
  flightTime: function () {
    var a = this.getOriginTime();
    var b = this.getDestinationTime();
    var duration = moment.utc(moment(b,"DD/MM/YYYY h:mm").diff(moment(a,"DD/MM/YYYY h:mm"))).format("h:mm");
    return duration.replace(":","h ") + "m"    
  },
  getKey: function (){
    if (!this._key) {
      this._key = Provider.generateKey(this);
    }
    return this._key;
  }
});
Provider.ASYNC_MODE = true;
Provider.all = {};
Provider.originHash = {};
Provider.destHash = {};


// --------------------
// Class methods below
// --------------------

/*
 *  Provider.storeCSVRows
 */
Provider.storeCSVRows = function(csvRows) { 
    for (var i = 0; i < csvRows.length; i++) {       
      // Create backbone model to represent provider
      Provider.store(new Provider(csvRows[i]));
  }
}

/*
 * Provider.keepCheapest()
 */
Provider.keepCheapest = function (provider) {
  var currentPrice = Provider.all[provider.getKey()].getPrice();
  var comparePrice = provider.getPrice();

  // Does the duplicate have a better price?
  if (comparePrice < currentPrice) {
    Provider.all[provider.getKey()] = provider;
  }
}

/*
 * Provider.store(provider)
 */
Provider.store = function (provider) {
    // Does this model exist in the global array?
    if (!Provider.all[provider.getKey()]) {
      // No - Store it
      Provider.all[provider.getKey()] = provider;
      // Cache the providers for fast lookup by origin and destination codes
      Provider.cacheByOrigin(provider);
      Provider.cacheByDestination(provider);
    } 
    else {
      // Yes - but keep the cheapest price
      Provider.keepCheapest(provider);
    }
}

/*
 * Provider.generateKey(provider)
 * 
 * Create a unique key given a provider.
 * (i.e. 742304834212_397497928239_JFK_YEG)
 */
Provider.generateKey = function(provider) {
    // var providerKey = "##Departure Time_##Destination Time_##Origin_##Destination_##Price";
    var providerKey = "##Departure Time_##Destination Time_##Origin_##Destination";
    providerKey = providerKey.replace("##Departure Time", provider.departureEpoc());
    providerKey = providerKey.replace("##Destination Time", provider.destinationEpoc());
    providerKey = providerKey.replace("##Origin", provider.getOrigin());
    providerKey = providerKey.replace("##Destination", provider.getDestination());
    //providerKey = providerKey.replace("##Price", provider.getPrice());
    return providerKey;
}

/*
 * Provider.cacheByOrigin()
 */
Provider.cacheByOrigin = function (provider) {
  // Setup convenient access for providers by origin
  if (!Provider.originHash[provider.getOrigin()])
    Provider.originHash[provider.getOrigin()] = [provider];
  else
    Provider.originHash[provider.getOrigin()].push(provider);
}

/*
 * Provider.cacheByDestination()
 */
Provider.cacheByDestination = function (provider) {
  // Setup convenient access for providers by destination
  if (!Provider.destHash[provider.getDestination()])
    Provider.destHash[provider.getDestination()] = [provider];
  else
    Provider.destHash[provider.getDestination()].push(provider);
 }

/*
 * Provider.flightsWithOrigin(code)
 */
Provider.flightsWithOrigin = function (code) {
  return Provider.originHash[code.toUpperCase()];
}

/*
 * Provider.flightsWithDestination(code)
 */
Provider.flightsWithDestination = function (code) {
  return Provider.destHash[code.toUpperCase()];
}

/*
 * Provider.clear()
 */
Provider.clear = function () {
  Provider.all = {};
  Provider.originHash = {};
  Provider.destHash = {};
}

Provider.flightsBetween = function (originCode, destinationCode) {
  var flights = Provider.flightsWithOrigin(originCode);
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

/*
 * Provider.first()
 */
Provider.first = function () {
  return Provider.all[Object.keys(Provider.all)[0]];
}

/*
 *  Provider.loadFromCSV(filename, callback)
 */
Provider.loadFromCSV = function (filename, callback) {

  // HTTP GET 'data/airport.txt'  
  $.ajax({
    type: "GET",
    url: filename,
    async: Provider.ASYNC_MODE,
    dataType: "text",
    error: function(error){
      if (error.status === 404) {
        throw new Error("Provider.loadFromCSV: File not found '"+filename+"'");
      }
    },
    success: function(data) {
      // parse the airport.txt as a csv file
      var provider_csv = $.parse(data,{header: true});
      Provider.storeCSVRows(provider_csv.results.rows);

      if (callback) callback(Provider.all);
    }
  });
}

/*
 *  Provider.count()
 */
Provider.count = function () {
  return Object.keys(Provider.all).length;
}