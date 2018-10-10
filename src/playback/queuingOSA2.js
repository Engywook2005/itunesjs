const osa = require('osa2');

class Queueing {

    constructor(trackStack = []) {
        // @TODO fill this in when done with dev testing. Should be about the same as queueing.js except there is no this->iTunes
    }

    // @TODO will need to revise this somewhat as everything is going to be returning promises
    addTrack() {
        /*
        const nextTrack = this.trackStack.shift(),
          dbID = nextTrack["Track ID"],
          tempPlaylist = this.findPlaylist(),
          trackToAdd = this.findTrack(dbID);
        
        if(trackToAdd && tempPlaylist) {
            this.addTrackToPlaylist(trackToAdd, tempPlaylist);
        }
     
        // Should be OK to return the shifted playlist before promises are carried out. 
        return tempPlaylist;
        */
    }

    findTrack(dbID) {

        const getKnownTracks = osa((dbID) => {
            const knownTracks = Application('iTunes').sources["Library"].userPlaylists.byName('masterplaylist').tracks; 
            let trackToAdd;

            for(let prop in knownTracks) {

                //console.log(dbID + " " + knownTracks[prop].databaseID());
                if(knownTracks[prop].databaseID() === dbID) {
                  console.log('found by database id: ' + knownTracks[prop].name());
                  trackToAdd = knownTracks[prop];
                  break;
                }
            }  
            
            //return true;
            // WHY THE FUCK IS THIS UNDEFINED WHEN I TRY TO SEND BACK AS-IS?
            // the resolve handler is undefined when I return trackToAdd; trackToAdd.name() is OK
            // I think I'll have to resolve the outer promise from here
            return trackToAdd;
            //resolve(trackToAdd.name());
        }); 
        getKnownTracks(dbID).then(function(data) {
            console.log("response: " + data);
        }).catch(
            function(error) {
                console.log("error: " + error);
            }
        );
    }
}

module.exports.Queueing = Queueing;

// @TODO test lines, remove
const queueing = new Queueing();
queueing.findTrack(19648);