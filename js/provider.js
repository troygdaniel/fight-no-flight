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
  // Get the Departure Time, and replace the '-' character with '/'
  // i.e. '6-23-2014' becomes '6/23/2014'
  departureTime: function () {
    return this.get("Departure Time").replace(/\-/g,'/');
  },
  // Get the Destination Time, and replace the '-' character with '/'
  destinationTime: function () {
    return this.get("Destination Time").replace(/\-/g,'/');
  },
  // Return a numeric value of "Departure time" for comparison and calculations
  departureEpoc: function() { 
    return moment(this.departureTime()).utc().valueOf();
  },
  // Return a numeric value of "Destination time" for comparison and calculations
  destinationEpoc: function() { 
    return moment(this.destinationTime()).utc().valueOf();
  },
  // Format a moment.js date
  formattedTime: function(momentDate) {
    return momentDate.format("MM/DD/YYYY HH:mm:ss");
  },
  // The formatted "Departure time"
  formattedOriginTime: function () {
    return this.formattedTime(this.getOriginTime(true));
  },
  // The formatted "Destination time"
  formattedDestinationTime: function () {
    return this.formattedTime(this.getDestinationTime(true));
  },
  // Moment.js date for "Departure time"
  // asLocalTime - allows the return value to be either UTC or local time
  getOriginTime: function (asLocalTime) {
    var airportCode = this.getOrigin();
    var originAirport = Airport.withCode(airportCode);
    var tz = originAirport.get("timezone");
    var dateAsString = ""+this.departureTime();

    if (!asLocalTime)
       dateAsString += " " + Airport.withCode(airportCode).timezoneOffset();

    return moment(dateAsString);
  },
  // Moment.js date for "Destination time"
  // asLocalTime - allows the return value to be either UTC or local time
  getDestinationTime: function (asLocalTime) {
    var airportCode = this.getDestination();
    var destAirport = Airport.withCode(airportCode);
    var tz = destAirport.get("timezone");
    var dateAsString = ""+this.destinationTime();

    if (!asLocalTime)
       dateAsString += " " + Airport.withCode(airportCode).timezoneOffset();

    return moment(dateAsString);
  },
  // The duration of the flight between the origin and destination
  // i.e.  5h 33m
  flightDuration: function () {
    var a = this.getOriginTime();
    var b = this.getDestinationTime();
    var duration = moment.utc(moment(b,"DD/MM/YYYY h:mm").diff(moment(a,"DD/MM/YYYY h:mm"))).format("h:mm");
    return duration.replace(":","h ") + "m";
  },
  // The unique key representing the provider, based on departure and destination time
  // i.e. "1402840440000_1402844700000_LAS_LAX"
  getKey: function (){
    if (!this._key) {
      this._key = ProviderList.generateKey(this);
    }
    return this._key;
  },
  // Validation to ensure model model is in a valid state
  // Is automatically invoked on .save() - but can be called with provider.isValid()
  validate: function (attrs, options) {    
    if (Provider.missingAttributes(attrs)) {
      return "Missing mandatory fields: {Origin},{Departure Time},{Destination},{Destination Time},{Price}";
    }    
    if (Provider.invalidAttributes(attrs)) {
      return "Invalid values for attributes.";
    }    
  },
  // Over-riding the sync method
  // Allows us to persist the models in the ProviderList array
  sync: function(method, model, options) {
      options || (options = {});

      switch (method) {
          case "update":
              ProviderList.store(this);
              break;
          case "create":
              ProviderList.store(this);
              break;
      }
      if (options.url)
          return Backbone.sync.call(model, method, model, options);
  }
});

// Convienience method to check for missing attributes
// ...called by validate()
Provider.missingAttributes = function (attrs){
  return (     
        !attrs["Origin"]  ||  
        !attrs["Departure Time"] ||  
        !attrs["Departure Time"] ||  
        !attrs["Destination"] ||  
        !attrs["Destination Time"] ||  
        !attrs["Price"]) === true;
};

// Convienience method to check for invalid attributes
// ...called by validate()
Provider.invalidAttributes = function (attrs){
  var isInvalid = true;
    
    // Is the Origin field invalid?
    isInvalid = ( isNaN(parseInt(attrs["Origin"])) === true);
    isInvalid = ( attrs["Origin"].length > 3  || attrs["Origin"].length < 3 );

    // Is the Destination field invalid?
    isInvalid = ( isNaN(parseInt(attrs["Destination"])) === true);
    isInvalid = ( attrs["Destination"].length > 3  || attrs["Destination"].length < 3 );

    // Is the Departure Time invalid?
    isInvalid = ( moment(attrs["Departure Time"].replace(/\-/g,'/')).format() === "Invalid date");    

    // Is the Destination Time invalid?
    isInvalid = ( moment(attrs["Destination Time"].replace(/\-/g,'/')).format() === "Invalid date");
    
    // Is the price invalid?
    var price = attrs["Price"].substring(1,attrs["Price"].length);
    isInvalid = ( isNaN (parseFloat(price)) === true);

  return isInvalid;
};

// Class variables
Provider.ASYNC_MODE = true;
Provider.all = {};
Provider.originHash = {};
Provider.destHash = {};