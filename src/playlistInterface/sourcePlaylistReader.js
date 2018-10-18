const Utils = require('../utils/utils').Utils;
const osa = require('osa2');

class SourcePlaylistReader {
    static getSourcePlaylist(playlistName) {

      return new Promise((resolve, reject) => {
          let returnedTracks = []; 

          const execGetSourcePlaylist = osa((descriptors, playlistName, startNumber)=> {
            // @TODO - Boilerplate code, wish I only needed to do this once
            const knownPlaylists = Application('iTunes').sources["Library"].userPlaylists, 
              targetPlaylist = knownPlaylists.byName(playlistName),
              knownTracks = targetPlaylist.tracks,
              endNumber = (startNumber + 1000 > knownTracks.length) ? knownTracks.length : 1000,
              sourcePlaylistTracks = []; 
            
            // @TODO instead check buffer on array size
            for(let i = startNumber; i < endNumber; i++) {
                const track = knownTracks[i], 
                  trackDescription = {};

               let trackAddable = true;

               // @TODO sigh more boilerplate.  
               try {
                for(let prop in descriptors) {
                    if(descriptors.hasOwnProperty(prop)) {
                        trackDescription[prop] = track[descriptors[prop]]();
                    }
                }
               } catch(err) {
                   trackAddable = false;
               }
               if(trackAddable) {
                 sourcePlaylistTracks.push(trackDescription);
               }
            }

            return sourcePlaylistTracks;

          });

          // @TODO this needs to be handled more elegantly - recursive function, EOF added 
          // to end of array when complete
          execGetSourcePlaylist(Utils.getTrackDescriptors(), playlistName, 0).then((data) => {
              returnedTracks = returnedTracks.concat(data);
              execGetSourcePlaylist(Utils.getTrackDescriptors(), playlistName, 1000).then((data) => {
                returnedTracks = returnedTracks.concat(data);
                resolve(returnedTracks);
              }).catch((err) => {
                reject(err);
              });
          }).catch((err) => {
              reject(err);
          });
      })
    }
}

module.exports.SourcePlaylistReader = SourcePlaylistReader;

// @TODO remove! test use case
SourcePlaylistReader.getSourcePlaylist('masterplaylist').then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});