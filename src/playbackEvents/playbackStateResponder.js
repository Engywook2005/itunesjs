const PlaybackStateListener = require('./playerStateListener').PlayerStateListener;

class PlaybackStateResponder {
    constructor() {
        this.playbackStateCallbacks = {};
        this.playbackStateListener = new PlaybackStateListener(this.playbackStateResponse);
    }

    setPlaybackStateResponse(playbackState, callback = () => {}) {
        this.playbackStateCallbacks[playbackState] = callback;
    };

    playbackStateResponse(playbackState) {
        const stateCallback = this.playbackStateCallbacks[playbackState];

        if(stateCallback && typeof stateCallback === 'function') {
          stateCallback();  
        }
    }

    startListener() {
        this.playbackStateListener.listenPlayerState();
    }
}

