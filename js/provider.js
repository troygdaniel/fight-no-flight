var Provider = Backbone.Model.extend({  
  // storeCity: "provider",
  // database: window.App.database,
});
Provider.ASYNC_MODE = true;
Provider.all = {};

/*
 *  Provider.setupData
 */
Provider.setupData = function(rows) { 
    for (var i = 0; i < rows.length; i++) {       
    var row = rows[i];
    // unique key (i.e. JFK_742304834_YEG_397497928239)
    var providerKey = "##Departure Time_##Destination Time_##Origin_##Destination";

    // Create backbone model to represent provider
    var provider = new Provider(row);
    
    // TODO: Move into model
    var deptUTC = moment(provider.get("Departure Time")).utc().valueOf();
    var destUTC = moment(provider.get("Destination Time")).utc().valueOf();
    providerKey = providerKey.replace("##Departure Time", deptUTC);
    providerKey = providerKey.replace("##Destination Time", destUTC);
    providerKey = providerKey.replace("##Origin", provider.get("Origin") );
    providerKey = providerKey.replace("##Destination", provider.get("Destination"));

    Provider.all[providerKey] = provider;
  }
  console.log(Provider.all);
}
/*
 *  Provider.loadFromCSV
 */
Provider.loadFromCSV = function (filename, callback) {

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
      Provider.all = {};

      // parse the airport.txt as a csv file
      var provider_csv = $.parse(data,{header: true});
      Provider.setupData(provider_csv.results.rows);

      if (callback) callback(Provider.all);
    }
  });
}

Provider.count = function () {
  return Object.keys(Provider.all).length;
}
