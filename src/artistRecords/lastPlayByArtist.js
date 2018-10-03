const fs = require('fs');

class LastPlayByArtist {
    constructor() {
        this.artistHistory = {};    
        this.hsDoc = __dirname + '/artistHistory.json';
    }

    // Called when checking next tracks to play (read) and when beginning playback.
    loadArtistHistory(cb) {
        fs.readFile(this.hsDoc, function(err, data) {
            if(data) {
                this.artistHistory = JSON.parse(data);
                cb(this);        
            }
            if(err) {
                console.log(err);
            }
        }.bind(this));
    }

    // When done with artist history write back to json (should only be necessary after updateArtist)
    finalizeArtistHistory(cb = function(caller, err) {}) {        
        fs.writeFile(this.hsDoc, JSON.stringify(this.artistHistory), {}, function(err) {
            cb(this, err);
        }.bind(this));
    }

    // Call when beginning playback of a track.
    updateArtist(name, timestamp) {
        this.artistHistory[name] = {
            'lastPlayed': timestamp
        } 
    }

    // checks last play. If never played, -1. Otherwise the last time the artist played.
    checkArtistLastPlay(name) {
        let lastPlayed = -1;
        if(this.artistHistory[name]) {
            lastPlayed = this.artistHistory[name].lastPlayed;
        }

        return lastPlayed;
    }
}

module.exports.LastPlayByArtist = LastPlayByArtist;