const itunes = require('playback')

class EventCapture {
  constructor (trackChangeCallback) {
    this.trackChangeCallback = trackChangeCallback
    this.currentTrack = null
    this.lastTrack = null
  }

  init () {
    this.listenForTrackChange()

    // @TODO listen for keypress to pause and resume
    // https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
    // will need to clear interval on checkPlaying, then call itunes.pause() - just p?
    // will also need to listen for a different keypress to get to process.exit - s

  }

  listenForTrackEnd(callback) {
    console.log('listening for track end');

    const checkPlaying = function() {
      const isPlaying = itunes.playing !==null ? true : false; 
      //console.log('check playing: ' + isPlaying + ", " + new Date().getTime());
      if(!isPlaying) {
        console.log('clearing interval. end of track.')

        // @TODO would say this should be handled by making a callback but this whole class readlly 
        // should use the osa library, same as playlistInterface
        clearInterval(checkInterval);
        callback();
        // Now play the last track on the playlist
      }
    }

    let checkInterval = setInterval(function() {
      checkPlaying();
    }, 1000);
  }

  listenForTrackChange () {
    const that = this

    const trackChangeCallback = function (trackPlaying) {
      if (JSON.stringify(that.currentTrack) !== JSON.stringify(trackPlaying)) {
        that.lastTrack = that.currentTrack
        that.currentTrack = trackPlaying
        that.trackChangeCallback(trackPlaying)
      }
    }

    // @TODO ideally there's a way to get track change without listening for the next track playing.
    itunes.on('playing', trackChangeCallback)
  }
}

module.exports.EventCapture = EventCapture
