const osa = require('osa2')

class Queueing {
  constructor (trackStack = []) {
    this.trackStack = trackStack
  }

  // @TODO via promises. Send back up to index.js.
  /**
     * Finds next track to play from the queue and passes on to findAndAddTrack.
     * @param {Boolean} startPlayback - If true, begin playing automatically.
     * @param {Object} currentTrack - used to verify that the next track isn't the one that's already playing.
     */
  addTrack (startPlayback, currentTrack = null) {
    if (this.trackStack.length <= 0) {
      return []
    }

    let nextTrack = this.trackStack.shift()

    try {
      if (currentTrack && nextTrack.dbID === currentTrack.dbID) {
        nextTrack = this.trackStack.shift()
      }
    } catch (err) {
      return []
    }

    const dbID = nextTrack.trackID

    this.findAndAddTrack(dbID, startPlayback)

    return this.trackStack
  }

  /**
     * Receives id of selected track to add to playlist. Tells iTunes to find this track and add it to playlist.
     * Called by addTrack.
     * @param {*} dbID - ID of track iTunes should add to the playlist.
     * @param {*} startPlayback - If true, begin playing automatically.
     */
  findAndAddTrack (dbID, startPlayback) {
    // @TODO want to look into this a bit more, but it seems that the function within osa is not permeable to
    // anything but primitives (e.g. no functions, iTunes tracks, etc can be gotten out of here or passed in via function.)

    // Definitely can't pass functions into here? If that's possible, I may be able to pass in the
    // trackfinding, playlistfinding, and track adding functions to the osa call...//#endregion
    const execAddTrack = osa((dbID, startPlayback) => {
      // @TODO configurable source and temp playlist names

      const knownPlaylists = Application('iTunes').sources['Library'].userPlaylists

      const knownTracks = knownPlaylists.byName('masterplaylist').tracks
      let trackToAdd, tempPlaylist

      for (let prop in knownTracks) {
        if (knownTracks[prop].databaseID() === dbID) {
          console.log('found by database id: ' + knownTracks[prop].name())
          trackToAdd = knownTracks[prop]
          break
        }
      }

      if (!trackToAdd) {
        return false
      }

      for (let prop in knownPlaylists) {
        if (knownPlaylists[prop].name() === 'tempUber') {
          tempPlaylist = knownPlaylists[prop]
        }
      }

      if (!tempPlaylist) {
        tempPlaylist = Application('iTunes').UserPlaylist().make()
        tempPlaylist.name = 'tempUber'
      }

      if (!tempPlaylist) {
        return false
      }

      trackToAdd.duplicate({ to: tempPlaylist })

      if (startPlayback && Application('iTunes').playerState() !== 'playing') {
        tempPlaylist.play()
      }

      return true
    })

    // @TODO handle failure outside of this class. Should findAndAddTrack should itself
    // return a promise.
    execAddTrack(dbID, startPlayback).then(function (data) {
      if (!data) {
        console.log('failure to find target track: ' + dbID)
        process.exit()
      }
    }).catch(
      function (error) {
        console.log('error: ' + error)
        process.exit()
      }
    )
  }
}

module.exports.Queueing = Queueing
