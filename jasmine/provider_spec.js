//  Specs for Take.NoteView
describe("Provider spec", function() {
  Provider.ASYNC_MODE = false;
  Provider.loadFromCSV("../data/provider3.txt");
  var exampleProvider = Provider.all['1402840440000_1402844700000_LAS_LAX'];

  describe("Provider.loadFromCSV", function() {    

    it("loads the example 'Provider1.txt' ", function () {
      Provider.clear();      
      Provider.loadFromCSV("../data/provider1.txt", function(_providers) {
          expect(Provider.count()).toEqual(8);
          expect(_providers).toEqual = Provider.all;          
      });
    });

    it("loads the example 'provider2.txt' ", function () {
      Provider.clear();
      Provider.loadFromCSV("../data/provider2.txt", function(_providers) {
          expect(Provider.count()).toEqual(13);
          expect(_providers).toEqual = Provider.all;          
      });
    });
    
    it("loads the example 'provider3.txt' ", function () {
      Provider.clear();
      Provider.loadFromCSV("../data/provider3.txt", function(_providers) {
          expect(Provider.count()).toEqual(14);
          expect(_providers).toEqual = Provider.all;          
      });
    });
    
    it("loads all examples and ignores duplicates ", function () {
      Provider.clear();
      Provider.loadFromCSV("../data/provider1.txt");
      Provider.loadFromCSV("../data/provider2.txt");
      Provider.loadFromCSV("../data/provider3.txt");
      expect(Provider.count()).toEqual(33);
      Provider.loadFromCSV("../data/provider3.txt");
      expect(Provider.count()).toEqual(33);
    }); 

  });
        
  describe("Provider.flightsWithOrigin", function() {    

    it("finds", function () {
      Provider.clear();
      Provider.loadFromCSV("../data/provider3.txt", function(_providers) {
          expect(Provider.flightsWithOrigin("YYZ").length).toEqual(3);
      });
    }); 

  });

  describe("Provider.flightsWithDestination", function() {    
    Provider.clear();
    Provider.loadFromCSV("../data/provider3.txt", function(_providers) {
      expect(Provider.flightsWithDestination("YYZ").length).toEqual(4);
    });
  }); 

  describe("flightsBetween()", function() {    
    it("will return a sorted array of flights between the origin and destination.", function () {
      expect(Provider.flightsBetween("LAS","LAX").length).toBeGreaterThan(0);
    }); 
  });


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

});