const fs = require('fs');

class LastPlayByArtist {
    constructor() {
        this.artistHistory = {};    
        this.hsDOc = './artistHistory.json';
    }

    // Called when checking next tracks to play (read) and when beginning playback.
    loadArtistHistry() {
        // @TODO promise?
        artistHistoryList = fs.readFile(this.hsDoc, function(err, data) {
            if(data) {
                this.artistHistory = JSON.parse(data);        
            }
        }.bind(this));
    }

    // When done with artist history write back to json (should only be necessary after updateArtist)
    finalizeArtistHistory() {
        fs.writeFile(this.hsDoc, JSON.stringify(this.artistHistory));
    }

    // Call when beginning playback of a track.
    updateArtist(name, timestamp) {
        this.artistHistory[name] = {
            // @TODO move getTime out to helper class. 
            'lastPlayed': new Date().getTime();
        } 
    }

    // checks last play. If never played, -1. Otherwise the last time the artist played.
    checkArtistLastPlay(name) {
        lastPlayed = -1;
        if(this.artistHistory[name]) {
            return this.artistHistory[name].lastPlayed;
        }
    }
}