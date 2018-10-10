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
        return new Promise((resolve, reject) => {
            const getKnownTracks = osa((promiseObj) => {
                const dbID = promiseObj.dbID;
                const resolve = promiseObj.resolve;
                const reject = promiseObj.reject;

                console.log(promiseObj.resolve);

                const knownTracks = Application('iTunes').sources["Library"].userPlaylists.byName('masterplaylist').tracks; 
    
                let trackToAdd;

                for(let prop in knownTracks) {
    
                    //console.log(dbID + " " + knownTracks[prop].databaseID());
                    if(knownTracks[prop].databaseID() === dbID) {
                      console.log('found by database id: ' + knownTracks[prop].name());
                      console.log(this);
                      trackToAdd = knownTracks[prop];
                      break;
                    }
                }  
                
                //resolve(trackToAdd);

                return true;
                // WHY THE FUCK IS THIS UNDEFINED WHEN I TRY TO SEND BACK AS-IS?
                // the resolve handler is undefined when I return trackToAdd; trackToAdd.name() is OK
                // I think I'll have to resolve the outer promise from here
                //return trackToAdd;
                //resolve(trackToAdd.name());
            }); 
            const promiseObj = {
                'dbID' : dbID,
                'resolve' : resolve,
                'reject' : reject
            }

            console.log(promiseObj.resolve);

            getKnownTracks(promiseObj).then(function(data) {
                console.log(data);
            }).catch(
                function(error) {
                    reject(error);
                }
            );
        });
    }
}

module.exports.Queueing = Queueing;

// @TODO test lines, remove
const queueing = new Queueing();
//queueing.findTrack(19648);

queueing.findTrack(19468).then(function(data) {
    console.log(data.name());
}).catch(function(error){
    console.log(error);
});