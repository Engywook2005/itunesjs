const PlaybackStateResponder = require('./playbackEvents').PlaybackStateResponder
const LastPlayByArtist = require('./artistRecords').LastPlayByArtist
const TrackListDisplay = require('./artistRecords').TrackListDisplay
const PlaylistParser = require('./playlistInterface').PlaylistParser
const PlaylistFilterSorter = require('./playlistInterface').PlaylistFilterSorter
const NextTrack = require('./playback').NextTrack;
const Queueing = require('./playback').Queueing;
const Utils = require('./utils').Utils;

let playbackStateResponder = new PlaybackStateResponder();
  isPaused = false,
  currentTrack = null;

/**
 * Called when a play event occurs. Checks to see if it is a different track from what has been
 * playing. If it is, updates artist history and queues another track to the playlist.
 *
 * @param {*} trackData
 */
const trackChangeCallback = function (trackData) {

  const artistRecord = new LastPlayByArtist();
    
  artistRecord.loadArtistHistory(function (err, caller) {
    if (err) {
      console.log(err)
      process.exit()
    }
    // @TODO date/time move to util function
    // I also think it's a problem that adding the next track is a response to update artist history...
    // If that feature doesn't work, this whole app doesn't work.
    caller.updateArtist(trackData.artist, new Date().getTime())
    caller.finalizeArtistHistory(function (err, caller) {
      if (err) {
        console.log(err)
        process.exit()
      }

      const addTrackToPlaylist = function() {
        getNextTrackStack().then(function (data) {
            // @TODO remove previous track
            const queueing = new Queueing(data),
            pl = queueing.addTrack(true);
        })    
      }
        
      // @TODO is it necessary to wait for the XML document to be rewritten?
      setTimeout(addTrackToPlaylist, 1000);
    })
  })
}

// Response to playing event
const checkNewTrack = function() {
  Utils.getCurrentTrack().then((data) => {
    // @FIXME currentTrack is never the same as currentTrack
    if(data !== currentTrack) {
      // probably because currentTrack is never updated?
      currentTrack = data;
      trackChangeCallback(data);
    }
  }).catch((err) => {
    console.log(err);
    process.exit();
  });

}

// Response to stopped event
const trackEndedCallback = function() {
  console.log('track ended callback');

  // @TODO configurable playlist name
  NextTrack.playLastTrack('tempUber');
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
        TrackListDisplay.listTracks(data)
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
    // @TODO cleaner presentation of data, ultimately dispatch to web interface
    const queueing = new Queueing(data),
      pl = queueing.addTrack(true);
  }).catch(function(err){
    console.log(err);
    process.exit();
  })
}

/**
 * Initializes playback event capture (listening for change in track).
 *
 */
const init = function () {
  // @TODO use playbackStateResponder

  playbackStateResponder.setPlaybackStateResponse('playing', () => {
    console.log('playing response')
    playbackStateResponder.setPlaybackStateResponse('stopped', () => {
      trackEndedCallback();
    });
    checkNewTrack();
  })

  playbackStateResponder.startListener();

  getFirstTrackStack()
}

module.exports.init = init
