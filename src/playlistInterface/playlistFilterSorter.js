const LastPlayByArtist = require('../artistRecords').LastPlayByArtist

/**
 * Uses config to filter and sort master playlist.
 */
class PlaylistFilterSorter {
  constructor (sortedCallback) {
    this.sortedCallback = sortedCallback
    this.lastPlayByArtist = new LastPlayByArtist()
  }

  /**
   * Externally callable function to sort playlist.
   *
   * @param {*} playList
   * @returns Promise
   */
  runSort (playList) {
    return new Promise(function (resolve, reject) {
      const recentArtistCallback = function (refinedPlaylist, err) {
        // refinedPlaylist is a simple array which will be filtered and sorted.
        // in any case I don't think theres any need to store this as an object from here on out.

        // After sorting by playcount, how long an array to sort by last played and ultimately return?
        // Limiting adds a bit more variety in what's played
        // @TODO make configurable
        const numberOnShortList = 25

        // Then filter by number of stars vs how long since played
        // @TODO - configurable how long to wait depending on number of starts
        refinedPlaylist = this.filterByStars(refinedPlaylist)

        // Then sort what's left by number of plays, in ascending order. Take the first 25.
        // @TODO - configurable how many tracks to take. The reason for doing this is a little hard to explain.
        refinedPlaylist = this.sortPlaylist(refinedPlaylist, 'Play Count')

        if (refinedPlaylist.length > numberOnShortList) {
          refinedPlaylist = refinedPlaylist.splice(0, numberOnShortList)
        }

        // Finally sort by last play date. In this case we do not need to worry about changing apple time to unix epoch
        refinedPlaylist = this.sortPlaylist(refinedPlaylist, 'Play Date')

        resolve(refinedPlaylist)
      }.bind(this)

      // Filter by artists recently played - that will shorten this list the most
      // @TODO - configurable how long to wait to play the same artist again
      this.filterRecentArtists(playList, recentArtistCallback)
    }.bind(this))
  }

  /**
   * Removes tracks that have been played too recently, with the threshold determined by rating.
   *
   * @param {Array} playListArray
   *
   * @returns Array
   */
  filterByStars (playListArray) {
    playListArray = playListArray.filter(function (playlistItem) {
      // @TODO also needs to be configurable

      const rankings = {
        '5': 28,
        '4': 56
      }

      const trackRating = (playlistItem.Rating / 20).toString()

      let minimumWait = 168

      if (rankings.hasOwnProperty(trackRating)) {
        minimumWait = rankings[trackRating]
      }

      minimumWait *= 24 * 3600 * 1000

      // @TODO need to do something about last played from playlist - this is on a different scale
      // See https://www.epochconverter.com/mac

      // @TODO this should be in utils as well
      const appleTimeStampToUnixEpoch = function (appleTime) {
        let unixTime = appleTime

        // How long between 1971 and 1904
        unixTime -= (66 * 365 * 24 * 3600)

        // Also have to account for leap years!
        unixTime -= (17 * 24 * 3600)

        // We store it in milliseconds
        unixTime *= 1000

        return unixTime
      }

      const lastPlay = appleTimeStampToUnixEpoch(playlistItem['Play Date'])

      return new Date().getTime() - lastPlay > minimumWait
    })

    return playListArray
  }

  /**
   * Generic sorting function for track objects.
   *
   * @param {Array} playListArray
   * @param {String} prop
   *
   * @returns Array;
   */
  sortPlaylist (playListArray, prop) {
    playListArray = playListArray.sort(function (itemA, itemB) {
      const itemAPlayCount = itemA[prop]

      const itemBPlayCount = itemB[prop]

      // Played fewer times? Bring to the front.
      if (itemAPlayCount < itemBPlayCount) {
        return -1
      }

      if (itemAPlayCount > itemBPlayCount) {
        return 1
      }

      return 0
    })

    return playListArray
  }

  /**
   * Removes tracks by artists that have been played within an amount of time specified in config.
   * Returns an array because this is going to be a lot easier to filter and sort than an object
   *
   * @param {Object} playList
   * @param {Function} callback
   *
   * @returns Array
   */
  filterRecentArtists (playList, callback) {
    this.lastPlayByArtist.loadArtistHistory(function (caller) {
      // @TODO dontPlaywithinDays should be a config
      const refinedPlaylist = []

      const dontPlayWithinDays = 1

      const minimumTime = dontPlayWithinDays * 24 * 3600 * 1000
      let currentTrackID, lastPlay
      for (currentTrackID in playList) {
        // @TODO Date.getTime is a utility function
        lastPlay = new Date().getTime() - this.lastPlayByArtist.checkArtistLastPlay(playList[currentTrackID].Artist)

        // @TODO - perhaps only for the web form - output time left before exluded artists are playable.
        /*
        if(lastPlay < minimumTime && playList[currentTrackID].Artist === "Jethro Tull") {
          console.log(playList[currentTrackID].Artist + " " + lastPlay + " " + minimumTime);
        }
        */

        if (lastPlay < 0 || lastPlay > minimumTime) {
          refinedPlaylist.push(playList[currentTrackID])
        }
      }

      callback(refinedPlaylist)
    }.bind(this))
  }
}

module.exports.PlaylistFilterSorter = PlaylistFilterSorter
