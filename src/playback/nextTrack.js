const osa = require('osa2')

// @TODO the name of this class is slightly confusing. Not clear that it plays the next track.
// Could even call this one DiscJockey. Or perhaps that's a better name for this whole class.
class NextTrack {
  static playLastTrack (playlistName) {
    console.log('jumping to last track')

    const execLastTrack = osa((playlistName) => {
      const knownPlaylists = Application('iTunes').sources['Library'].userPlaylists

      const targetPlaylist = knownPlaylists.byName(playlistName)

      const knownTracks = targetPlaylist.tracks

      knownTracks[knownTracks.length - 1].play()

      return true
    })

    // @TODO don't exit here if this breaks, but do need to have an error handler at top level
    execLastTrack(playlistName).then().catch()
  }
}

module.exports.NextTrack = NextTrack

// REMOVE - Testing only
// NextTrack.playLastTrack('tempUber');
