const osa = require('osa2');
const DisplayOutput = require('../output').DisplayOutput;

// @TODO the name of this class is slightly confusing. Not clear that it plays the next track.
// Could even call this one DiscJockey. Or perhaps that's a better name for this whole class.
class DiscJockey {
    static playLastTrack (playlistName) {
        DisplayOutput.simpleMessage('jumping to last track', 'queue status');

        const execLastTrack = osa((playlistName) => {
            const knownPlaylists = Application('iTunes').sources['Library'].userPlaylists;

            const targetPlaylist = knownPlaylists.byName(playlistName);

            const knownTracks = targetPlaylist.tracks;

            knownTracks[knownTracks.length - 1].play();

            return true;
        });

        // @TODO don't exit here if this breaks, but do need to have an error handler at top level
        execLastTrack(playlistName).then().catch();
    }
}

module.exports.DiscJockey = DiscJockey;
