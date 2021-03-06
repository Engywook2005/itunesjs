/* global module*/

/**
 * Records and retrieves last time an artist has been played.
 */
class LastPlay {
    constructor () {
        this.playbackHistory = [];
    }

    /**
   * Sets timestamp when artist was last played. Called when beginning playback of a track.
   * @param {*} name
   */
    updatePlaybackHistory (name) {
        this.playbackHistory.push(name);
    }

    checkLastPlayBack (name) {
        return this.playbackHistory.indexOf(name) >= 0;
    }
}

module.exports.LastPlayRecord = LastPlay;
