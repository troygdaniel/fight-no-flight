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
      this._key = ProviderList.generateKey(this);
    }
    return this._key;
  },
  validate: function (attrs, options) {
    console.log("Provider#validate()");
    if (Provider.missingAttributes(attrs)) {
      return "Missing mandatory fields: {Origin},{Departure Time},{Destination},{Destination Time},{Price}";
    }    
    if (Provider.invalidAttributes(attrs)) {
      return "Invalid values for attributes.";
    }    
  },
});
Provider.missingAttributes = function (attrs){
  return (     
        !attrs["Origin"] 
    ||  !attrs["Departure Time"] 
    ||  !attrs["Departure Time"] 
    ||  !attrs["Destination"] 
    ||  !attrs["Destination Time"] 
    ||  !attrs["Price"]) === true;
}
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
}
Provider.ASYNC_MODE = true;
Provider.all = {};
Provider.originHash = {};
Provider.destHash = {};