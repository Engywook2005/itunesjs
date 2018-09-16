const itunes = require('playback');

export default class EventCapture {

    constructor(trackChangeCallback) {
        this.trackChangeCallback = trackChangeCallback;
        this.currentTrack = null;
        this.lastTrack = null;
    }

    init() {
        listenForTrackChange();
    }

    listenForTrackChange() {
        const that = this;

        const trackChangeCallback = function(trackPlaying) {
            if(that.currentTrack && that.currentTrack !== trackPlaying) {
                that.lastTrack = that.currentTrack;
                that.currentTrack = trackPlaying;
                that.trackChangeCallback(trackPlaying);
            }
        }

        // @TODO ideally there's a way to get track change without listening for the next track playing.
        itunes.on('playing', trackChangeCallbackl);

    }
}
