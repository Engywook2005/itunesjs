const fs = require('fs')

/**
 * Records and retrieves last time an artist has been played.
 */
class LastPlayByArtist {
  constructor () {
    this.artistHistory = {}
    this.hsDoc = __dirname + '/artistHistory.json' // eslint-disable-line no-path-concat
  }

  // @TODO may be necessary to only load the artistHistory when app first loads and resave the updated
  // version when shutting down. I am seeing that sometimes (for certain artists? System too busy? artistHistory
  // is too long?) 
  // 1. I see 'buffer' followed by a bunch of numbers output
  // 2. The same track is queued up next because:
  // 3. Instead of the artist appearing in /artistHistory.json, I have a property called 'undefined' instead
  // of the artist we started playing.
  // Per stackoverflow's suggested I have added an encoding to the call to fs.readFile. If that doesn't work
  // I'll probably need to do something like the above.
  // Noted 2018/10/13: Still a problem. It really does seem to be an issue only with some artists:
  // Joshua Bell & Academy of St. Martin in the Fields
  // Greg Kihn band
  //
  // Will at least need to make choosing the next track not depend on the lastPlayByArtist feature,
  // which I think is a problem anyway.

  /**
   * Called when checking next tracks to play (read) and when beginning playback of track (write).
   * 
   * @param {Function} cb
   */
  loadArtistHistory (cb) {
    fs.readFile(this.hsDoc, 'utf8', function (err, data) {
      if (data) {
        this.artistHistory = JSON.parse(data)
        cb(err, this)
      }
    }.bind(this))
  }

  /**
    * Once an artist's last play time is updated, write the artist history back to JSON file.
    *
    * @param {Function} cb
    */
  finalizeArtistHistory (cb = function (err, caller) {
    if (err) {
      console.log(err)
      process.exit()
    }
  }) {
    fs.writeFile(this.hsDoc, JSON.stringify(this.artistHistory), {}, function (err) {
      cb(err, this)
    }.bind(this))
  }

  /**
   * Sets timestamp when artist was last played. Called when beginning playback of a track.
   * @param {*} name
   * @param {*} timestamp
   */
  updateArtist (name, timestamp) {
    this.artistHistory[name] = {
      'lastPlayed': timestamp
    }
  }

  /**
   * Checks last time an artist has been played.
   *
   * @param {String} name
   *
   * @returns {Number}  -1 if never played.
   */
  checkArtistLastPlay (name) {
    let lastPlayed = -1
    if (this.artistHistory[name]) {
      lastPlayed = this.artistHistory[name].lastPlayed
    }

    return lastPlayed
  }
}

module.exports.LastPlayByArtist = LastPlayByArtist
