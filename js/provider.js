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
  departureEpoc: function() { 
    return moment(this.get("Departure Time")).utc().valueOf();
  },
  destinationEpoc: function() { 
    return moment(this.get("Destination Time")).utc().valueOf();
  },
  /*
   * getOriginTime()
   */
  getOriginTime: function () {
    var airportCode = this.getOrigin();
    var originAirport = Airport.withCode(airportCode);
    var tz = originAirport.get("timezone")
    return moment(""+this.get("Departure Time") + " " + Airport.withCode(airportCode).timezoneOffset());
  },
  /*
   * getDestinationTime()
   */
  getDestinationTime: function () {
    var airportCode = this.getDestination();
    var destAirport = Airport.withCode(airportCode);
    var tz = destAirport.get("timezone")
    return moment(""+this.get("Destination Time") + " " + Airport.withCode(airportCode).timezoneOffset());
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
  key: function (){
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
    var provider = new Provider(csvRows[i]);    
    Provider.store(provider);
  }
}

/*
 * Provider.keepCheapest()
 */
Provider.keepCheapest = function (provider) {
  var currentPrice = Provider.all[provider.key()].getPrice();
  var comparePrice = provider.getPrice();

  // Does the duplicate have a better price?
  if (comparePrice < currentPrice) {
    Provider.all[key] = provider;
  }
}

/*
 * Provider.store(provider)
 */
Provider.store = function (provider) {
    // Does this model exist in the global array?
    if (!Provider.all[provider.key()]) {
      // No - Store it
      Provider.all[provider.key()] = provider;
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
    var providerKey = "##Departure Time_##Destination Time_##Origin_##Destination";
    providerKey = providerKey.replace("##Departure Time", provider.departureEpoc());
    providerKey = providerKey.replace("##Destination Time", provider.destinationEpoc());
    providerKey = providerKey.replace("##Origin", provider.getOrigin());
    providerKey = providerKey.replace("##Destination", provider.getDestination());
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
  return Provider.originHash[code];
}

/*
 * Provider.flightsWithDestination(code)
 */
Provider.flightsWithDestination = function (code) {
  return Provider.destHash[code];
}

/*
 * Provider.clear()
 */
Provider.clear = function () {
  Provider.all = {};
  Provider.originHash = {};
  Provider.destHash = {};
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