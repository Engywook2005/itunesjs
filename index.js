const UberPlaylistManager = require('./src');
const trackChangeCallback = function(trackData) {
    console.log(trackData);
};

(function() {
    //console.log(UberPlaylistManager.EventCapture);
    const eventCapture = new UberPlaylistManager.EventCapture(trackChangeCallback);
    eventCapture.init();
})();

module.exports = UberPlaylistManager;