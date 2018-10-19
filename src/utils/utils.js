const osa = require('osa2');

class Utils {

    /**
     * Maps track descriptor points to name of function to be called on track object.
     * 
     * This is a workaround for osa being unable to accept functions as an argument and also 
     * being unable to return a track object. 
     * 
     * @returns {object}
     */
    static getTrackDescriptors() {
        // Property name we are using : function to be called on track
        return {
            'trackID': 'databaseID',
            'name': 'name',
            'artist': 'artist',
            'album': 'album',
            'duration': 'duration',
            'lastPlayed': 'playedDate',
            'playCount': 'playedCount',
            'rating': 'rating'        
        }
    }

    static getCurrentTrack() {
        // @TODO needs to either be a promise or send a callback itself. Ugh.

        return new Promise((resolve, reject) => {
            const listCurrentTrack = osa(function (descriptors) {
                const track = Application('iTunes').currentTrack(),
                  trackDescription = {};

                  for(let prop in descriptors) {
                      if(descriptors.hasOwnProperty(prop)) {
                          trackDescription[prop] = track[descriptors[prop]]();
                      }
                  }

                  return trackDescription;
            });

            listCurrentTrack(Utils.getTrackDescriptors()).then((data) => {
              resolve(data);  
            }).catch((err) => {
              reject(err);
            });
        });
    }

    // If right now, don't pass an argument
    static getTimestamp(formattedDate = null, asMS = true) {
        const date = formattedDate ? new Date(formattedDate) : new Date();
       
        const timestamp = date.getTime();

        if(asMS) {
          return timestamp; 
        } else {
          return Math.floor(timestamp / 1000);
        }
    }

    // @TODO tighten this up
    static secondsToHoursMinutesSeconds(seconds) {
        let remainderSeconds = 0;

        let hours = Math.floor(seconds / 3600);
        if(hours < 10) {
            hours = '0' + hours;
        }

        remainderSeconds = seconds % 3600;

        let minutes = Math.floor(remainderSeconds / 60);
        if(minutes < 10) {
            minutes = '0' + minutes;
        }

        remainderSeconds = Math.floor(remainderSeconds % 60);

        if(remainderSeconds < 10) {
            remainderSeconds = '0' + remainderSeconds;
        }

        return hours + ':' + minutes + ':' + remainderSeconds;
    }
}

module.exports.Utils = Utils;
