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
            'trackId': 'databaseID',
            'name': 'name',
            'artist': 'artist',
            'album': 'album',
            'lastPlayed': 'playedDate',
            'playCount': 'playedCount',
            'rating': 'rating'
        }
    }

    static getCurrentTrack() {
        // @TODO needs to either be a promise or send a callback itself. Ugh.

        return new Promise((resolve, reject) => {
            const utilsBucket = {
                returnUtils: function() {
                    return Utils;
                }
            }

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
}

module.exports.Utils = Utils;
