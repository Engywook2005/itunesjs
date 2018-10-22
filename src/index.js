const PlaybackStateResponder = require('./playbackEvents').PlaybackStateResponder
const LastPlayByArtist = require('./artistRecords').LastPlayByArtist
const TrackListDisplay = require('./artistRecords').TrackListDisplay
const PlaylistFilterSorter = require('./playlistInterface').PlaylistFilterSorter
const SourcePlaylistReader = require('./playlistInterface').SourcePlaylistReader
const NextTrack = require('./playback').NextTrack
const Queueing = require('./playback').Queueing
const Utils = require('./utils').Utils

let playbackStateResponder = new PlaybackStateResponder()

let currentTrack = null

/**
 * Called when a playing event occurs and the current track is not the same as the last track
 * (meaning that the playhead has moved on to a different track and we need to add another track
 * to the playlist)
 *
 * @param {*} trackData
 */
const trackChangeCallback = function (trackData) {
  const artistRecord = new LastPlayByArtist()

  // Updates last time a track by this artist has been played.
  artistRecord.loadArtistHistory(function (err, caller) {
    if (err) {
      console.log('WARNING: ' + err)
    }
    // @TODO I think it's a problem that adding the next track is a response to update artist history...
    // If that feature doesn't work, this whole app doesn't work.
    caller.updateArtist(trackData.artist, Utils.getTimestamp())
    caller.finalizeArtistHistory(function (err, caller) {
      if (err) {
        console.log('WARNING: ' + err)
      }

      addTrackToPlaylist()
    })
  })
}

/**
 * Compares current track to last track, in response to a playing event. If a different track is
 * now playing (i.e. wasn't the user clicking resume), it's time to respond accordingly (i.e. play another track).
 *
 */
const checkNewTrack = function () {
  Utils.getCurrentTrack().then((data) => {
    if (!currentTrack || (data.trackID !== currentTrack.trackID)) {
      currentTrack = data
      TrackListDisplay.listTracks([ data ], 'Now playing')
      trackChangeCallback(data)
    }
  }).catch((err) => {
    console.log(err)
    process.exit()
  })
}

/**
 * Pulls updated queue of tracks and appends the top of the queue to the
 * target playlist.
 *
 */
const addTrackToPlaylist = function () {
  getNextTrackStack().then(function (data) {
    const queueing = new Queueing(data)
    // queueing.addTrack will return a promise, indicating number of tracks left. Check on tracklist length to
    // determine whether to kill process here.
    pl = queueing.addTrack(true)
    if (pl.length === 0) {
      // @TODO send to UI instead of logging here.
      console.log('Queue is empty. Exiting.')
      process.exit()
    }
  }).catch((err) => {
    console.log(err)
    process.exit()
  })
}

/**
 * Response to stop event. Call to playLastTrack triggers the playing event, and its responders.
 */
const trackEndedCallback = function () {
  // @TODO configurable playlist name
  NextTrack.playLastTrack('tempUber')
}

/**
 * Assembles next tracks to play in desired order.
 *
 * @returns Promise
 */
const getNextTrackStack = function () {
  return new Promise(function (resolve, reject) {
    const parseCallback = function (playlist) {
      // Filter and sort playlist.
      const playlistFilterSorter = new PlaylistFilterSorter()

      playlistFilterSorter.runSort(playlist).then(function (data) {
        TrackListDisplay.listTracks(data, 'Tracks in queue:')
        resolve(data)
      }).catch((err) => {
        reject(err)
      })
    }

    // @TODO make configurable
    SourcePlaylistReader.getSourcePlaylist('masterplaylist').then((data) => {
      parseCallback(data)
    }).catch((err) => {
      reject(err)
    })
  })
}

/**
 * Initializes playback event capture (listening for change in track).
 *
 */
const init = function () {
  playbackStateResponder.setPlaybackStateResponse('playing', () => {
    playbackStateResponder.setPlaybackStateResponse('stopped', () => {
      trackEndedCallback()
    })
    checkNewTrack()
  })

  // playing event will trigger after addTrackToPlaylist, kicking off cycle.
  playbackStateResponder.startListener()

  // Since we're not playing, this call will cause the app to:
  // 1. Generate a queue
  // 2. Create the target playlist
  // 3. Add the first track in the queue to the playlist
  // 4. Play that track in the playlist.
  addTrackToPlaylist()
}

module.exports.init = init
