const itunes = require('playback')
const readline = require('readline')

class EventCapture {
  constructor (trackChangeCallback) {
    this.trackChangeCallback = trackChangeCallback
    this.isPaused = false
    this.currentTrack = null
    this.lastTrack = null
  }

  init () {
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    // @TODO for clarity let's call this checkPlayingInterval
    this.checkInterval = 0;
    this.listenForKeypress()
    this.listenForTrackChange()

    // @TODO listen for keypress to pause and resume
    // https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
    // will need to clear interval on checkPlaying, then call itunes.pause() - just p?
    // will also need to listen for a different keypress to get to process.exit
    // may be necessary to write out that artistHistory.json then - I eventually run into problems with that if 
    // running too long (too many artists?)

        // @TODO this whole class really should use the osa library, same as playlistInterface

  }

  listenForKeypress() {
    process.stdin.on('keypress', (str, key) => {
      if(key.name === 'p') {
        // @TODO clean up double negative here, move pause and resume ops to their own functions
        // (on a different class?) Would be handy when also doing this via browser.
        if(!this.isPaused) {
          clearInterval(this.checkInterval);
          itunes.pause();
          this.isPaused = true;
        } else {
          itunes.play();
          if(this.trackEndCallback) {
            this.listenForTrackEnd(this.trackEndCallback);
          }
          this.isPaused = false;
        }
      }
      if(key.ctrl && key.name === 'c') {
        process.exit();
      }
    });
  }

  listenForTrackEnd(callback) {
    this.trackEndCallback = callback;

    console.log('listening for track end');

    const checkPlaying = function() {
      const isPlaying = itunes.playing !==null ? true : false; 
      //console.log('check playing: ' + isPlaying + ", " + new Date().getTime());
      if(!isPlaying) {
        console.log('clearing interval. end of track.')

        clearInterval(this.checkInterval);
        callback();
      }
    }.bind(this);

    this.checkInterval = setInterval(function() {
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
