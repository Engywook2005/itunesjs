const itunes = require('playback')

class EventCapture {
  constructor (trackChangeCallback) {
    this.trackChangeCallback = trackChangeCallback
    this.currentTrack = null
    this.lastTrack = null
  }

  init () {
    this.listenForTrackChange()
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
