//  Specs for Take.NoteView
describe("ProviderSearch spec", function() {
  Provider.ASYNC_MODE = false;
        
  describe("ProviderSearch.flightsWithOrigin", function() {    

    it("finds 4 flights that match the origin code of 'YYZ'", function () {
      ProviderList.clear();
      ProviderList.loadFromCSV("../data/provider3.txt", function(_providers) {
          expect(ProviderSearch.flightsWithOrigin("YYZ").length).toEqual(3);
      });
    });
  });

  it("finds 4 flights that match the destination code of 'YYZ'", function () {
    ProviderList.clear();
    ProviderList.loadFromCSV("../data/provider3.txt", function(_providers) {
      expect(ProviderSearch.flightsWithDestination("YYZ").length).toEqual(4);
    });
  }); 

  it("will return a sorted array of flights between the origin and destination.", function () {
    expect(ProviderSearch.flightsBetween("LAS","LAX").length).toBeGreaterThan(0);
  }); 

});