const LastPlayByArtist = require('../artistRecords').LastPlayByArtist;

class PlaylistFilterSorter {
    constructor(sortedCallback) {
        this.sortedCallback = sortedCallback;
        this.lastPlayByArtist = new LastPlayByArtist();
    }

    // @TODO this will also need to return a promise
    runSort(playList) {
        return new Promise(function(resolve, reject) {
            const recentArtistCallback = function(refinedPlaylist, err) {
                // refinedPlaylist is a simple array @TODO why not an array to begin with? Starting with an object is easier to work with though...
                // in any case I don't think theres any need to store this as an object from here on out.
    
                // After sorting by playcount, how long an array to sort by last played and ultimately return? 
                // Limiting adds a bit more variety in what's played
                // @TODO make configurable
                const numberOnShortList = 25;
    
                // Then filter by number of stars vs how long since played
                // @TODO - configurable how long to wait depending on number of starts
                refinedPlaylist = this.filterByStars(refinedPlaylist);
    
                // Then sort what's left by number of plays, in ascending order. Take the first 25.
                // @TODO - configurable how many tracks to take. The reason for doing this is a little hard to explain.
                refinedPlaylist = this.sortPlaylist(refinedPlaylist, 'Play Count');
    
                if(refinedPlaylist.length > numberOnShortList) {
                    refinedPlaylist = refinedPlaylist.splice(0, numberOnShortList);
                }
    
                // Finally sort by last play date. In this case we do not need to worry about changing apple time to unix epoch
                refinedPlaylist = this.sortPlaylist(refinedPlaylist, 'Play Date');
    
                resolve(refinedPlaylist);
    
            }.bind(this);
    
            // Filter by artists recently played - that will shorten this list the most
            // @TODO - configurable how long to wait to play the same artist again
            this.filterRecentArtists(playList, recentArtistCallback);
        }.bind(this));
    }

    filterByStars(playListArray) {     
        playListArray = playListArray.filter(function(playlistItem) {
            // @TODO also needs to be configurable    

            const rankings = {
                    '5' : 28,
                    '4' : 56
                },
                trackRating = (playlistItem.Rating / 20).toString();    

                let minimumWait = 168;

                if(rankings.hasOwnProperty(trackRating)) {
                    minimumWait = rankings[trackRating];
                }

                minimumWait *= 24 * 3600 * 1000;

                // @TODO need to do something about last played from playlist - this is on a different scale
                // See https://www.epochconverter.com/mac

                // @TODO this should be in utils as well
                const appleTimeStampToUnixEpoch = function(appleTime) {
                    let unixTime = appleTime;

                    // How long between 1971 and 1904
                    unixTime -= (66 * 365 * 24 * 3600);

                    // Also have to account for leap years!
                    unixTime -= (17 * 24 * 3600);    
                    
                    // We store it in milliseconds
                    unixTime *= 1000;

                    return unixTime;
                }

                const lastPlay = appleTimeStampToUnixEpoch(playlistItem['Play Date']);     

                return new Date().getTime() - lastPlay > minimumWait;
        });

        return playListArray;
    }

    sortPlaylist(playListArray, prop) {
        playListArray = playListArray.sort(function(itemA, itemB) {
            const itemAPlayCount = itemA[prop],
                itemBPlayCount = itemB[prop];

            // Played fewer times? Bring to the front.
            if(itemAPlayCount < itemBPlayCount) {
                return -1;
            }

            if(itemAPlayCount > itemBPlayCount) {
                return 1;
            }

            return 0;
        });

        return playListArray;
    }

    filterRecentArtists(playList, callback) {
        this.lastPlayByArtist.loadArtistHistory(function(caller) {
            // @TODO dontPlaywithinDays should be a config
            // going to ordinary array because this is going to be a lot easier to filter and sort than an object
            const refinedPlaylist = [], 
                dontPlayWithinDays = 1, 
                minimumTime = dontPlayWithinDays * 24 * 3600 * 1000;
            let currentTrackID, lastPlay;
            for(currentTrackID in playList) {
                // @TODO Date.getTime is a utility function
                lastPlay = new Date().getTime() - this.lastPlayByArtist.checkArtistLastPlay(playList[currentTrackID].Artist);

                if(lastPlay < 0 || lastPlay > minimumTime) {
                    refinedPlaylist.push(playList[currentTrackID]);                        
                }
            }

            callback(refinedPlaylist);
        }.bind(this) );
    }
}

module.exports.PlaylistFilterSorter = PlaylistFilterSorter;