fight-no-flight
===============

## Running examples:
CLI desktop browser can be found here:
- http://troygdaniel.com/flight_cli/


Simple Web UI:
- http://troygdaniel.com/flight


Jasmine tests can be run here:
- http://troygdaniel.com/flight/jasmine/spec_runner.html


There are 5 relevant classes:
- __Airport__ both a backbone model, and class methods to load all data
- __Provider__ the backbone model for the provider csv row
- __ProviderList__ manages access to the global (in-memory) array of providers
- __ProviderSearch__ provides searching capability based on origin and destination
- __ProviderListView__ renders simple CLI text responses

Here is how you would implement the above classes:
```javascript

// Load all airports from the CSV data file
Airport.loadFromCSV(function(){
  // on success - async load the provider CSV's
  ProviderList.loadFromCSV("data/provider1.txt");
  ProviderList.loadFromCSV("data/provider2.txt");
  ProviderList.loadFromCSV("data/provider3.txt");
});
        
// Create a new View object 
var providerListView = new ProviderListView();

// Get the CLI response for flights between YYZ and YYC
var textResponse = providerListView.cliFlightsBetween("YYZ", "YYC");
// output:
// YYZ --> YYC (06/15/2014 06:45:00 --> 06/15/2014 08:54:00) - 4h 09m - $578.00
// YYZ --> YYC (06/22/2014 12:00:00 --> 06/22/2014 14:09:00) - 4h 09m - $630.00
// YYZ --> YYC (06/26/2014 12:00:00 --> 06/26/2014 14:09:00) - 4h 09m - $630.00
```

The Airport model can be used to lookup an airport, assuming that the async load is complete.
```javascript
var anAirport = Airport.withCode("YYZ");
```

As well, the provider backbone model allows us to validate and save models, without regard for the peristance implementation.
```javascript
var validFields = {
      "Origin": "LAS",
      "Departure Time": "6/15/2014 9:54:00",
      "Destination": "LAX",
      "Destination Time": "6/15/2014 11:05:00",
      "Price": "$321.00"
};
// Backbone models are created 
var provider = new Provider(validFields);
// Validation can be called at anytime to check to state of the model
var isValid = provider.isValid(); 
provider.on("invalid", function(model, error) {
    alert(error);
});
// Persists the model in the Provider.all global array
provider.save();
```

The classes and instance variable names were intentionally lifted from the requirements to maintain the same shared understanding of the problem.

## Relevant test cases:
  https://github.com/troygdaniel/fight-no-flight/tree/master/jasmine

## JS source code:
  https://github.com/troygdaniel/fight-no-flight/tree/master/js
