//  Specs for Take.NoteView
describe("ProviderList spec", function() {
  Provider.ASYNC_MODE = false;
  ProviderList.loadFromCSV("../data/provider3.txt");
  // LAS|6/15/2014 9:54:00|LAX|6/15/2014 11:05:00|$286.00
  var exampleProvider = Provider.all['1402840440000_1402844700000_LAS_LAX'];
  var cheaperFlight = {
      "Origin": "LAS",
      "Departure Time": "6/15/2014 9:54:00",
      "Destination": "LAX",
      "Destination Time": "6/15/2014 11:05:00",
      "Price": "$123.00"
  };
  var costlyFlight = {
      "Origin": "LAS",
      "Departure Time": "6/15/2014 9:54:00",
      "Destination": "LAX",
      "Destination Time": "6/15/2014 11:05:00",
      "Price": "$321.00"
  };

  describe("ProviderList.generateKey()", function () {
    it("generates valid unique keys for a provider", function() {
      var provider = new Provider({
        "Origin": "LAS",
        "Departure Time": "6/15/2014 9:54:00",
        "Destination": "LAX",
        "Destination Time": "6/15/2014 11:05:00",
        "Price": "$321.00"
      });
      expect(ProviderList.generateKey(provider)).toEqual("1402840440000_1402844700000_LAS_LAX");
    });
  });

  describe("ProviderList.clear()", function(){
    it("clears the Provider arrays ", function () {
      Provider.all=['one'];
      Provider.originHash={"two":2};
      Provider.destHash = {"three": 3};
      expect(ProviderList.count()).toEqual(1);
      ProviderList.clear();
      expect(ProviderList.count()).toEqual(0);      
    });
  });

  describe("ProviderList.loadFromCSV()", function() {    

    it("rejects invalid filenames ", function () {
      var filename = "../notadirectory/provider1.txt";
      ProviderList.clear();
      expect(function () {
          ProviderList.loadFromCSV(filename);
      }).toThrow(new Error("Provider.loadFromCSV: File not found '"+filename+"'"));
    });

    it("loads the example 'provider1.txt' ", function () {
      ProviderList.clear();
      ProviderList.loadFromCSV("../data/provider1.txt", function(_providers) {
          expect(ProviderList.count()).toEqual(8);
          expect(_providers).toEqual = Provider.all;          
      });
    });

    it("loads the example 'provider2.txt' ", function () {
      ProviderList.clear();
      ProviderList.loadFromCSV("../data/provider2.txt", function(_providers) {
          expect(ProviderList.count()).toEqual(13);
          expect(_providers).toEqual = Provider.all;          
      });
    });
    
    it("loads the example 'provider3.txt' ", function () {
      ProviderList.clear();
      ProviderList.loadFromCSV("../data/provider3.txt", function(_providers) {
          expect(ProviderList.count()).toEqual(14);
          expect(_providers).toEqual = Provider.all;          
      });
    });
    
    it("loads all examples and ignores duplicates ", function () {
      ProviderList.clear();
      ProviderList.loadFromCSV("../data/provider1.txt");
      ProviderList.loadFromCSV("../data/provider2.txt");
      ProviderList.loadFromCSV("../data/provider3.txt");
      expect(ProviderList.count()).toEqual(33);
      ProviderList.loadFromCSV("../data/provider3.txt");
      expect(ProviderList.count()).toEqual(33);
    }); 
  });

  describe("ProviderList.keepCheapest()", function() {        

    it("keep the cheapest flight when added to the store", function () {
      ProviderList.clear();
      ProviderList.loadFromCSV("../data/provider3.txt");

      
      var cheapieProvider = new Provider(cheaperFlight); // Create a cheap flight
      ProviderList.store(cheapieProvider); // Add the cheap flight to the list        
      expect(ProviderList.count()).toEqual(14); // Provider count to remain the same

      // Grab the example, and expect the cheaper price
      var winner = Provider.all['1402840440000_1402844700000_LAS_LAX'];
      expect(winner.getPrice()).toEqual(123);          
    });

    it("ignore the costly flight if added to the list", function () {
      ProviderList.clear();
      ProviderList.loadFromCSV("../data/provider3.txt");
      
      var costlyProvider = new Provider(costlyFlight); // Create a costly flight
      ProviderList.store(costlyProvider); // Add the costly flight to the list      
      expect(ProviderList.count()).toEqual(14); // Provider count to remain the same

      // Grab the example, and expect the cheaper price
      var winner = Provider.all['1402840440000_1402844700000_LAS_LAX'];
      expect(winner.getPrice()).toEqual(286);          
    });

  });
});