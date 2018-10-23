const Logger = require('../log/logger').Logger

/**
 * Handles display output.
 */
class DisplayOutput {
  /**
   * Outputs list of tracks, including now playing.
   * @param {Object} data - list of tracks.
   * @param {String} message - instructions on where to display output. For purposes of console.log,
   *                           message precedes track list output.
   */
  static listTracks (data, message = null) {
    // @TODO when a web form message will indicate target element on page to receive the message
    if (message) {
      Logger.logMessage('*** ' + message + ' ***')
    }

    for (let i = 0; i < data.length; i++) {
      const trackOnList = {
        'trackID': data[i].trackID,
        'artist': data[i].artist,
        'name': data[i].name,
        'album': data[i].album,
        'playCount': data[i].playCount,
        'lastPlayed': data[i].lastPlayed,
        'rating': data[i].rating
      }
      Logger.logMessage((i + 1) + '. ' + JSON.stringify(trackOnList))
    }
  }

  /**
   * Outputs simple string message.
   * @param {String} string - String to be output.
   * @param {String} message - Where message should be displayed.
   */
  static simpleMessage (string, message) {
    Logger.logMessage(message + ': ' + string)
  }

  /**
   * Reports error.
   * @param {Error} err
   */
  static errorMessage (err) {
    Logger.logError(err)
  }
}

module.exports.DisplayOutput = DisplayOutput
