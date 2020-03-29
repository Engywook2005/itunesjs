/* global module */
/* global require */

const DisplayOutput = require('../output').DisplayOutput;
const SourcePlaylistReader = require('./sourcePlaylistReader');
const Utils = require('../utils').Utils;

/**
 * Uses config to filter and sort master playlist.
 */
class PlaylistFilterSorter {
    constructor (lastPlayRecords) {
        this.lastPlayRecords = lastPlayRecords;
    }

    /**
   * Externally callable function to sort playlist.
   *
   * @param {Object} playList
   * @returns Promise
   */
    runSort (playList) {
        return new Promise(function (resolve, reject) {
            // @TODO err should be first? Also handle err
            const recentArtistAlbumEtcCallback = function (refinedPlaylist, err) {
                if (err) {
                    reject(err);
                }

                // refinedPlaylist is a simple array which will be filtered and sorted.
                // in any case I don't think theres any need to store this as an object from here on out.

                // After sorting by playcount, how long an array to sort by last played and ultimately return?
                // Limiting adds a bit more variety in what's played
                // @TODO make configurable
                const numberOnShortList = 25;

                // Then filter by number of stars vs how long since played
                // @TODO - we only need to do this once, move to static function?
                refinedPlaylist = this.filterByStars(refinedPlaylist);

                // Then sort what's left by number of plays, in ascending order. Take the first 25.
                // @TODO - configurable how many tracks to take. The reason for doing this is a little hard to explain.
                refinedPlaylist = this.sortPlaylist(refinedPlaylist, 'playCount');

                this.logTimeRemaining(refinedPlaylist);

                if (refinedPlaylist.length > numberOnShortList) {
                    refinedPlaylist = refinedPlaylist.splice(0, numberOnShortList);
                }

                // Finally sort by last play date. In this case we do not need to worry about changing apple time to unix epoch
                refinedPlaylist = this.sortPlaylist(refinedPlaylist, 'lastPlayed');

                resolve(refinedPlaylist);
            }.bind(this);

            // Filter by artists recently played - that will shorten this list the most
            // @TODO - configurable how long to wait to play the same artist again
            this.filterRecentArtistsAlbumsEtc(playList, recentArtistAlbumEtcCallback);
        }.bind(this));
    }

    /**
   * Iterates through track list and outputs total duration remaining in the track list as
   * it currently stands.
   * @param {Object} playlist - List of tracks.
   */
    logTimeRemaining (playlist) {
        let timeRemaining = 0;

        // @TODO use Array.reduce
        for (let i = 0; i < playlist.length; i++) {
            timeRemaining += playlist[i].duration;
        }

        const timeString = Utils.secondsToHoursMinutesSeconds(timeRemaining);

        DisplayOutput.simpleMessage(timeString, 'Time remaining in queue');
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
            };

            const trackRating = (playlistItem.rating / 20).toString();

            const rightNow = Utils.getTimestamp();

            // @TODO instead make sure only one three star track is allowed per day. The below just removes
            let minimumWait = 1826;

            if (rankings.hasOwnProperty(trackRating)) {
                minimumWait = rankings[trackRating];
            }

            minimumWait *= 24 * 3600 * 1000;

            const lastPlay = playlistItem.lastPlayed ? Utils.getTimestamp(playlistItem.lastPlayed) : rightNow;

            if (!playlistItem.lastPlayed) {
                return true;
            }

            return rightNow - lastPlay > minimumWait;
        });

        return playListArray;
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
            // @TODO this can be more than one property, not necessarily playCount so rename variables
            const itemAPlayCount = itemA[prop];

            const itemBPlayCount = itemB[prop];

            // Played fewer times or played less recently? Bring to the front.
            if ((itemAPlayCount < itemBPlayCount) || !itemAPlayCount) {
                return -1;
            }

            if ((itemAPlayCount > itemBPlayCount) || !itemBPlayCount) {
                return 1;
            }

            return 0;
        });

        return playListArray;
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
    filterRecentArtistsAlbumsEtc (playList, callback) {
        const recordSet = Object.keys(this.lastPlayRecords);

        const refinedPlaylist = [];

        const blacklist = [];

        recordSet.forEach((recorderName) => {
            const recorder = this.lastPlayRecords[recorderName].class;

            console.log(recorder);

            playList.forEach((playListItem) => {
                if (recorder.checkLastPlayBack(playListItem[recorder.search])) {
                    blacklist.push(playListItem);
                }
            });
        });

        playList.forEach((playListItem) => {
            if (blacklist.indexOf(playListItem) < 0) {
                refinedPlaylist.push(playListItem);
            }
        });

        // So we don't have to keep going back to the original masterPlaylist...
        SourcePlaylistReader.setRemainingTracks(refinedPlaylist);

        callback(refinedPlaylist);
    }
}

module.exports.PlaylistFilterSorter = PlaylistFilterSorter;
