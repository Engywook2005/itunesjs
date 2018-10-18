const osa = require('osa2');

// @TODO the name of this class is slightly confusing. Not clear that it plays the next track.
// Could even call this one DiscJockey. Or perhaps that's a better name for this whole class.
class NextTrack {

    static playLastTrack(playlistName) {
        console.log('jumping to last track');

        const execLastTrack = osa((playlistName) => {
            const knownPlaylists = Application('iTunes').sources["Library"].userPlaylists, 
                targetPlaylist = knownPlaylists.byName(playlistName),
                knownTracks = targetPlaylist.tracks; 

            knownTracks[knownTracks.length - 1].play();    

            return true;
        });

        execLastTrack(playlistName).then(console.log).catch(console.error);
    }
}

module.exports.NextTrack = NextTrack;

//REMOVE - Testing only
//NextTrack.playLastTrack('tempUber');