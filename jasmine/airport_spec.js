//  Specs for Take.NoteView
describe("Airport spec", function() {
  Airport.DATA_URL = "../data/airports.txt";
  Airport.ASYNC_MODE = false;
  Airport.loadFromCSV();
  Airport.ASYNC_MODE = true;
        
  describe("[Class methods]", function() {    

    it("will fetch the Toronto airport with an airport code of YYZ.", function () {
        Airport.fetchAirportByCode("YYZ", function(airport) {
          expect(airport.get("name")).toEqual("Lester B Pearson Intl");  
        });        
    });

    it("will fetch the Tokyo airport with an airport code of NRT.", function () {
        Airport.fetchAirportByCode("NRT", function(airport) {
          expect(airport.get("name")).toEqual("Narita Intl");  
        });
    });


    it("will fetch all Toronto airports.", function () {
      Airport.fetchAirportsByCity("Toronto", function(airports) {
        var codes = [];
        for (var i = airports.length - 1; i >= 0; i--) {
          codes.push(airports[i].get("iata_faa"));
        }
        expect(codes.indexOf("YYZ")).toBeGreaterThan(-1);
        expect(codes.indexOf("YTZ")).toBeGreaterThan(-1);
        expect(codes.indexOf("YZD")).toBeGreaterThan(-1);
        expect(codes.indexOf("YZD")).toBeGreaterThan(-1);
        expect(codes.indexOf("YBZ")).toBeGreaterThan(-1);
        expect(codes.indexOf("YTO")).toBeGreaterThan(-1);
      });

    });

    it("will fetch all Tokyo airports.", function () {
      Airport.fetchAirportsByCity("Tokyo", function(airports) {
        var codes = [];      
        for (var i = airports.length - 1; i >= 0; i--) {
          codes.push(airports[i].get("iata_faa"));
        }
        expect(codes.indexOf("TYO")).toBeGreaterThan(-1);
        expect(codes.indexOf("HND")).toBeGreaterThan(-1);
        expect(codes.indexOf("NRT")).toBeGreaterThan(-1);
      });
    });

  });
});