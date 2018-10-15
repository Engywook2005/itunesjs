const osa = require('osa2');

class Utils {
    static getCurrentTrack() {
        // @TODO needs to either be a promise or send a callback itself. Ugh.

        return new Promise((resolve, reject) => {
            const listCurrentTrack = osa(() => {
                const track = Application('iTunes').currentTrack();
    
                return {
                    'name': track.name(),
                    'artist': track.artist(),
                    'album': track.album()
                }
            });
    
            listCurrentTrack().then((data) => {
              resolve(data);  
            }).catch((err) => {
              reject(err);
            });
        });
    }
}

module.exports.Utils = Utils;

// REMOVE!!! testing only
/*
Utils.getCurrentTrack().then((data) => {
  console.log(data);
}).catch((err) => {
  console.log(err);
});
*/