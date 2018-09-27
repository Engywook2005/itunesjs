const UberPlaylistManager = require('./src');
const trackChangeCallback = function(trackData) {
    const artistRecord = new UberPlaylistManager.LastPlayByArtist();
    artistRecord.loadArtistHistory(function(caller) {
        caller.updateArtist(trackData.artist, new Date().getTime());
        caller.finalizeArtistHistory();    
        console.log(caller);
    });
    // @TODO move to util func
    console.log(trackData);
};

(function() {
    //console.log(UberPlaylistManager.EventCapture);
    const eventCapture = new UberPlaylistManager.EventCapture(trackChangeCallback);
    eventCapture.init();
})();

module.exports = UberPlaylistManager;