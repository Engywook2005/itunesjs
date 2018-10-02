const UberPlaylistManager = require('./src');

// @TODO move all this a level down to src/index.js
const trackChangeCallback = function(trackData) {
    const artistRecord = new UberPlaylistManager.LastPlayByArtist();
    artistRecord.loadArtistHistory(function(caller) {
        // @TODO move to util function
        caller.updateArtist(trackData.artist, new Date().getTime());
        caller.finalizeArtistHistory();    
    });
    // @TODO call to get next stack of tracks
    const nextTrackStack = getNextTrackStack();
    // @TODO remove previous track and add next track nextTrackStack[0])
    console.log(trackData);
};

const getNextTrackStack = function() {

    const parseCallback = function(playlist, err) {
        // Filter and sort playlist.
        const playlistFilterSorter = new UberPlaylistManager.PlaylistFilterSorter();

        playlistFilterSorter.runSort(playlist);

    };

    const playlistParser = new UberPlaylistManager.PlaylistParser(parseCallback);  
    playlistParser.readLibraryToJSON();

    // @TODO this is a place where it would be sensible to use a promise.
    return false;
};

const getFirstTrackStack = function() {
    const trackStack = getNextTrackStack();
    // @TODO add first two to temporary playlist
    // @TODO start playing the playlist
};

// @TODO call this function on src/index.js as an IIFE
(function() {

    //console.log(UberPlaylistManager.EventCapture);
    const eventCapture = new UberPlaylistManager.EventCapture(trackChangeCallback);

    // @TODO REINSTATE!!!
    //eventCapture.init();

    getFirstTrackStack();
})();

module.exports = UberPlaylistManager;