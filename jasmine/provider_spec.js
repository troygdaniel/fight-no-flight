//  Specs for Take.NoteView
describe("Provider model spec", function() {
  Provider.ASYNC_MODE = false;
  ProviderList.loadFromCSV("../data/provider3.txt");
  // LAS|6/15/2014 9:54:00|LAX|6/15/2014 11:05:00|$286.00
  var exampleProvider = Provider.all['1402840440000_1402844700000_LAS_LAX'];
  var validFields = {
      "Origin": "LAS",
      "Departure Time": "6/15/2014 9:54:00",
      "Destination": "LAX",
      "Destination Time": "6/15/2014 11:05:00",
      "Price": "$321.00"
  };
  var invalidFields = {
      "Orin": "LAS",
      "Deture Time": "6/15/2014 9:54:00",
      "Detination": "LAX",
      "Dstation Time": "6/15/2014 11:05:00",
      "Pre": "$321.00"
  };
  var invalidValues = {
      "Origin": "123",
      "Departure Time": "whattimeisitmrwolf",
      "Destination": "123",
      "Destination Time": "whattimeisitmrwolf",
      "Price": "dontask"
  };

  describe("#getOriginTime()", function() {    
    it("will get the origin UTC date/time for a provider", function () {
      expect(exampleProvider).toBeDefined();
      expect(exampleProvider.getOriginTime().utc().format()).toEqual("2014-06-15T16:54:00+00:00");
    });
  });

  describe("#getDestinationTime", function() {    
    it("will get the destination UTC date/time for a provider", function () {
      expect(exampleProvider).toBeDefined();
      expect(exampleProvider.getDestinationTime().utc().format()).toEqual("2014-06-15T18:05:00+00:00");
    });
  });

  describe("#flightTime()", function() {    
    it("will calculate the flight time for a flight ", function () {
      expect(exampleProvider.flightTime()).toEqual("1h 11m");      
    }); 
  });

  describe("#getPrice()", function() {    
    it("will return price as a numeric value", function () {
      expect(exampleProvider.getPrice()).toEqual(286);
    }); 
  });

  describe("#validate()", function() {        
    // TOOO: find a way to test this
    // invalidProvider.on("invalid", function(model, error) {
    //   expect(error).toEqual("Missing mandatory fields: {Origin},{Departure Time},{Destination},{Destination Time},{Price}");
    // });

    it("will expect all fields to be provided", function () {
      var validProvider = new Provider(validFields);
      expect(validProvider.isValid()).toEqual(true);
    }); 

    it("will fail validation if there are any missing fields", function () {
      var invalidProvider = new Provider(invalidFields);
      expect(invalidProvider.isValid()).toEqual(false);
      expect(invalidProvider.validationError).toEqual("Missing mandatory fields: {Origin},{Departure Time},{Destination},{Destination Time},{Price}");
    }); 

    it("(pending) will fail validation if there are any missing values", function () {
      var invalidProvider = new Provider(invalidValues);
      expect(invalidProvider.isValid()).toEqual(false);
      expect(invalidProvider.validationError).toEqual("Invalid values for attributes.");
    }); 
  });

});