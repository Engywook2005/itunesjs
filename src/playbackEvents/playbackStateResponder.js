const PlaybackStateListener = require('./playerStateListener').PlayerStateListener

class PlaybackStateResponder {
  constructor () {
    this.playbackStateCallbacks = {}
    this.playbackStateListener = new PlaybackStateListener(this.playbackStateResponse.bind(this))
  }

  setPlaybackStateResponse (playbackState, callback = () => {}) {
    this.playbackStateCallbacks[playbackState] = callback
  };

  playbackStateResponse (playbackState) {
    console.log(playbackState)

    const stateCallback = this.playbackStateCallbacks[playbackState]

    if (stateCallback && typeof stateCallback === 'function') {
      stateCallback()
    }

    this.startListener()
  }

  startListener () {
    this.playbackStateListener.listenPlayerState()
  }
}

module.exports.PlaybackStateResponder = PlaybackStateResponder
