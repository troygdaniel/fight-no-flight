//  Specs for Take.NoteView
describe("Airport spec", function() {
  var airports = new Airports();
  
  describe("Class methods", function() {    

    it("will confirm airport table is loaded.", function () {
      airports.fetch();

      if (airports.length > 0) {
        expect(Airports.hasData()).toEqual(true);
      }
      else {
       expect(Airports.hasData()).toEqual(false); 
      }
    });

    it("will find an airport given a code.", function () {      
      Airports.loadFromCSV();
    });

    it("will load data if no data in airport table.", function () {
      Airports.loadFromCSV();
    });

    it("will fetch an airport by city.", function () {
      Airports.fetchAirportByCity("Toronto");
    });

    it("will fetch an airport by its airport code.", function () {
      Airports.fetchAirportByCode("YYZ");
    });
  });

});