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
    return new Promise(function(resolve, reject) {
        const parseCallback = function(playlist, err) {

            // Filter and sort playlist.
            const playlistFilterSorter = new UberPlaylistManager.PlaylistFilterSorter();
    
            playlistFilterSorter.runSort(playlist).then(function(data) {
                resolve(data);
            });
    
        };
    
        const playlistParser = new UberPlaylistManager.PlaylistParser(parseCallback);  
        playlistParser.readLibraryToJSON();
    });
};

const getFirstTrackStack = function() {
    getNextTrackStack().then(function(data) {
        console.log(JSON.stringify(data));
        process.exit();
        ///@TODO add first two to temporary playlist
        // @TODO start playing the playlist
    });
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