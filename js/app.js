window.App = {}
window.App.database = {
    id: "flightnetwork",
    description: "The database for the FlightNetwork",
    migrations : [
        {
            version: "1.0",
            migrate: function(transaction, next) {                
                var airports_store = transaction.db.createObjectStore("airports"); 
                airports_store.createIndex("iata_faaIndex", "iata_faa", { unique: true}); 
                airports_store.createIndex("airport_idIndex", "airport_id", { unique: true}); 
                var providers_store = transaction.db.createObjectStore("providers"); 
                next();
            }
        }
    ]
}

Date.prototype.stdTimezoneOffset = function() {
    var jan = new Date(this.getFullYear(), 0, 1);
    var jul = new Date(this.getFullYear(), 6, 1);
    return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}

Date.prototype.dst = function() {
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

// HACK - does this work for all regions?
Date.isNowDst = function () {
    var now = new Date();
    return (now.dst());
}
