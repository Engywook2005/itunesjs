const fs = require('fs')

const itunesData = require('itunes-data')

const parser = itunesData.parser()

class PlaylistParser {
  constructor (playlistParsedCallback) {
    this.itunesLibrary = {}
    // @TODO this will need to be configurable. Also, pass as argument?
    // @TODO ugh this has to be full path, no ~ allowed?
    // expand-tilde may help here: https://www.npmjs.com/package/expand-tilde
    this.pathToLibary = '/Users/greg.thorson/Music/iTunes/iTunes Music Library.xml'
    this.stream = null
    this.constructedPlaylist = {}
    this.itemsFilled = 0
    this.playlistLength = 0
    this.playlistParsedCallback = playlistParsedCallback
  };

  // @TODO should make this shoot a callback - perhaps with the constructedPlaylist object?
  readLibraryToJSON () {
    let allTracks = {}

    parser.on('playlist', function (playlist) {
      // @TODO - make configurable
      if (playlist.Name === 'masterplaylist') {
        this.playlistLength = playlist['Playlist Items'].length
        for (let i = 0; i < playlist['Playlist Items'].length; i++) {
          // @TODO should make this a function call to populate with track data if it's already been stored.
          const newTrackRecord = {}

          const trackID = playlist['Playlist Items'][i]['Track ID']
          this.constructedPlaylist[trackID] = newTrackRecord
          this.tryToAddTrackToPlaylist(trackID, allTracks)
        }
      };
    }.bind(this))

    parser.on('track', function (track) {
      allTracks[track['Track ID']] = track
      this.tryToAddTrackToPlaylist(track['Track ID'], allTracks)
    }.bind(this))

    this.stream = fs.createReadStream(this.pathToLibary)

    this.stream.pipe(parser)
  }

  // If we have a playlist, AND this track id is on the playlist, AND we have a matching track, bring them together.
  tryToAddTrackToPlaylist (trackID, allTracks) {
    if (this.constructedPlaylist[trackID] && allTracks[trackID]) {
      this.constructedPlaylist[trackID] = allTracks[trackID]
      this.itemsFilled++

      // If we have a playlist, and it's been filled, it's go-time.
      // @TODO I don't know why this is now stopping at one short. Race condition?
      if (this.playlistLength > 0 && this.itemsFilled >= this.playlistLength - 1) {
        // @TODO make callback here - this will really need to be able to take an error condition as well
        this.playlistParsedCallback(null, this.constructedPlaylist)
      }
    }
  }
}

module.exports.PlaylistParser = PlaylistParser
