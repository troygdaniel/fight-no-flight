//  Specs for Take.NoteView
describe("Provider spec", function() {

  describe("Provider.loadFromCSV", function() {    

    it("loads the example 'Provider1.txt' ", function () {
      Provider.ASYNC_MODE = false;
      Provider.loadFromCSV("../data/provider1.txt", function(_providers) {
          expect(Object.keys(_providers)).toBeDefined();
          expect(Object.keys(_providers).length).toEqual(8);
          expect(Provider.count()).toEqual(8);
          expect(_providers).toEqual = Provider.all;          
      });
    }); 

    it("(pending) throws an exception for file not found", function () {
    }); 

    it("(pending) loads the example 'Provider2.txt' ", function () {
    }); 
    
    it("(pending) loads the example 'Provider3.txt' ", function () {
    }); 

  });
        
  describe("Provider.all", function() {    

    it("(pending) ", function () {
    }); 
    it("(pending) ", function () {
    }); 

  });

  describe("Provider.setupData", function() {    

    it("(pending) ", function () {
    }); 
    it("(pending) ", function () {
    }); 

  });

});