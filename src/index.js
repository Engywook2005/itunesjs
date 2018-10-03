const EventCapture = require('./playbackEvents').EventCapture
const LastPlayByArtist = require('./artistRecords').LastPlayByArtist
const PlaylistParser = require('./playlistInterface').PlaylistParser
const PlaylistFilterSorter = require('./playlistInterface').PlaylistFilterSorter

/**
 * Called when a play event occurs. Checks to see if it is a different track from what has been
 * playing. If it is, updates artist history and queues another track to the playlist.
 *
 * @param {*} trackData
 */
const trackChangeCallback = function (trackData) {
  const artistRecord = new LastPlayByArtist()
  artistRecord.loadArtistHistory(function (err, caller) {
    if (err) {
      console.log(err)
      process.exit()
    }
    // @TODO date/time move to util function
    caller.updateArtist(trackData.artist, new Date().getTime())
    caller.finalizeArtistHistory()
  })
  // @TODO call to get next stack of tracks - this may need to be in the callback for finalizeArtistHistory
  // also should be in the form of a promise
  // const nextTrackStack = getNextTrackStack()
  // @TODO remove previous track and add next track nextTrackStack[0])
  console.log(trackData)
}

/**
 * Assembles next tracks to play in desired order.
 *
 * @returns Promise
 */
const getNextTrackStack = function () {
  return new Promise(function (resolve, reject) {
    const parseCallback = function (err, playlist) {
      if (err) {
        console.log(err)
        process.exit()
      }

      // Filter and sort playlist.
      const playlistFilterSorter = new PlaylistFilterSorter()

      playlistFilterSorter.runSort(playlist).then(function (data) {
        resolve(data)
      })
    }

    const playlistParser = new PlaylistParser(parseCallback)
    playlistParser.readLibraryToJSON()
  })
}

/**
 * Gets set of tracks to play, in order. Adds the first two tracks to temporary playlist.
 * Starts playback on the temporary playlist.
 */
const getFirstTrackStack = function () {
  getNextTrackStack().then(function (data) {
    console.log(JSON.stringify(data))
    /// @TODO add first two to temporary playlist
    // @TODO start playing the playlist
  })
}

/**
 * Initializes playback event capture (listening for change in track).
 *
 */
const init = function () {
  const eventCapture = new EventCapture(trackChangeCallback)

  eventCapture.init()

  getFirstTrackStack()
}

module.exports.init = init
