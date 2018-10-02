const LastPlayByArtist = require('../artistRecords').LastPlayByArtist;

class PlaylistFilterSorter {
    constructor(sortedCallback) {
        this.sortedCallback = sortedCallback;
        this.lastPlayByArtist = new LastPlayByArtist();
    }

    // @TODO this will also need to return a promise
    runSort(playList) {
        const recentArtistCallback = function(refinedPlaylist, err) {
            // refinedPlaylist is a simple array @TODO why not an array to begin with? Starting with an object is easier to work with though...
            // in any case I don't think theres any need to store this as an object from here on out.
            refinedPlaylist = this.filterByStars(refinedPlaylist);
            console.log(refinedPlaylist);

        }.bind(this);

        this.filterRecentArtists(playList, recentArtistCallback);

        // Filter by artists recently played - that will shorten this list the most
        // @TODO - configurable how long to wait to play the same artist again

        // Then filter by number of stars vs how long since played
        // @TODO - configurable how long to wait depending on number of starts

        // Then sort what's left by number of plays, in ascending order. Take the first 25.
        // @TODO - configurable how many tracks to take. The reason for doing this is a little hard to explain.

        // Then sort by most recently played

        // Sorted callback with result.
        return playList;
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