ProviderList = {};

// Iterate through csv rows, store and create models
ProviderList.storeCSVRows = function(csvRows) { 
    for (var i = 0; i < csvRows.length; i++) {       
      // Create backbone model to represent provider
      ProviderList.store(new Provider(csvRows[i]));
  }
};

// Compare existing provider against a possible cheaper duplicate entry
// (withing Provider.all)
ProviderList.keepCheapest = function (provider) {
  var currentPrice = Provider.all[provider.getKey()].getPrice();
  var comparePrice = provider.getPrice();

  // Does the duplicate have a better price?
  if (comparePrice < currentPrice) {
    Provider.all[provider.getKey()] = provider;
  }
};

// Persist the model in the global array
ProviderList.store = function (provider) {
    // Does this model exist in the global array?
    if (!Provider.all[provider.getKey()]) {
      // No - Store it
      Provider.all[provider.getKey()] = provider;
      // Cache the providers for fast lookup by origin and destination codes
      ProviderList.cacheByOrigin(provider);
      ProviderList.cacheByDestination(provider);
    } 
    else {
      // Yes - but keep the cheapest price
      ProviderList.keepCheapest(provider);
    }
};


// Create a unique key given a provider.
// (i.e. 742304834212_397497928239_JFK_YEG)
ProviderList.generateKey = function(provider) {
    var providerKey = "##Departure Time_##Destination Time_##Origin_##Destination";
    providerKey = providerKey.replace("##Departure Time", provider.departureEpoc());
    providerKey = providerKey.replace("##Destination Time", provider.destinationEpoc());
    providerKey = providerKey.replace("##Origin", provider.getOrigin());
    providerKey = providerKey.replace("##Destination", provider.getDestination());

    return providerKey;
};

// Create a cachedArray of providers by Origin (YYZ)
// i.e. { "YYZ": [provider1, provider2],"LAX": [provider3, provider4]}
ProviderList.cacheByOrigin = function (provider) {
  // Setup convenient access for providers by origin
  if (!Provider.originHash[provider.getOrigin()])
    Provider.originHash[provider.getOrigin()] = [provider];
  else
    Provider.originHash[provider.getOrigin()].push(provider);
};

// Create a cachedArray of providers by Destination (YYZ)
// i.e. { "YYZ": [provider1, provider2],"LAX": [provider3, provider4]}
ProviderList.cacheByDestination = function (provider) {
  // Setup convenient access for providers by destination
  if (!Provider.destHash[provider.getDestination()])
    Provider.destHash[provider.getDestination()] = [provider];
  else
    Provider.destHash[provider.getDestination()].push(provider);
 };

// Remove all entries of the global array, and lookup hashes
ProviderList.clear = function () {
  Provider.all = {};
  Provider.originHash = {};
  Provider.destHash = {};
};

// Convenience method to grab the first provider
ProviderList.first = function () {
  return Provider.all[Object.keys(Provider.all)[0]];
};

// ASYNC load a provider csv
ProviderList.loadFromCSV = function (filename, callback) {

  // HTTP GET 'data/airport.txt'  
  $.ajax({
    type: "GET",
    url: filename,
    async: Provider.ASYNC_MODE,
    dataType: "text",
    error: function(error){
      if (error.status === 404) {
        throw new Error("Provider.loadFromCSV: File not found '"+filename+"'");
      }
    },
    success: function(data) {
      // parse the airport.txt as a csv file
      var provider_csv = $.parse(data,{header: true});
      ProviderList.storeCSVRows(provider_csv.results.rows);

      if (callback) callback(Provider.all);
    }
  });
};

// The current count of providers in the global array
ProviderList.count = function () {
  return Object.keys(Provider.all).length;
};