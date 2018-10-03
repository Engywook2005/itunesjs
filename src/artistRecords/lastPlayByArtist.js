const fs = require('fs')

/**
 * Records and retrieves last time an artist has been played.
 */
class LastPlayByArtist {
  constructor () {
    this.artistHistory = {}
    this.hsDoc = __dirname + '/artistHistory.json' // eslint-disable-line no-path-concat
  }

  /**
   * Called when checking next tracks to play (read) and when beginning playback of track (write).
   *
   * @param {Function} cb
   */
  loadArtistHistory (cb) {
    fs.readFile(this.hsDoc, function (err, data) {
      if (data) {
        this.artistHistory = JSON.parse(data)
        cb(err, this)
      }
      if (err) {
        console.log(err)
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
