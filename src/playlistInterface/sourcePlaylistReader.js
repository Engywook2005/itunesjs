/* global Application */
/* global module */
/* global require */

const Utils = require('../utils/utils').Utils;
const osa = require('osa2');

let remainingTracks;

class SourcePlaylistReader {
    static getSourcePlaylist (playlistName) {
        return new Promise((resolve, reject) => {
            if(remainingTracks) {
                resolve(remainingTracks);
                return;
            }

            let returnedTracks = [];

            const execGetSourcePlaylist = osa((descriptors, playlistName, startNumber, lengthLimit = 1000) => {
                // @TODO - Boilerplate code, wish I only needed to do this once
                const knownPlaylists = Application('Music').sources['Library'].userPlaylists;

                const targetPlaylist = knownPlaylists.byName(playlistName);

                const knownTracks = targetPlaylist.tracks;

                const sourcePlaylistTracks = [];

                // @TODO would be nicer to check on the buffer size we're in danger of overflowing.
                let i = startNumber;

                while (i < knownTracks.length && sourcePlaylistTracks.length < lengthLimit) {
                    const track = knownTracks[i];

                    const trackDescription = {};

                    let trackAddable = true;

                    // @TODO sigh more boilerplate.
                    try {
                        for (const prop in descriptors) {
                            if (descriptors.hasOwnProperty(prop)) {
                                trackDescription[prop] = track[descriptors[prop]]();
                            }
                        }
                    }
                    catch (err) {
                        trackAddable = false;
                    }

                    sourcePlaylistTracks.push(trackAddable ? trackDescription : { 'placeholder': true });

                    i++;
                }

                // If we've gotten to the last track let the caller know we are done.
                if (i === knownTracks.length) {
                    sourcePlaylistTracks.push('eof');
                }

                return sourcePlaylistTracks;
            });

            const sourcePlaylistToObject = function (startNumber = 0) {
                execGetSourcePlaylist(Utils.getTrackDescriptors(), playlistName, startNumber, 500).then((data) => {
                    returnedTracks = returnedTracks.concat(data);
                    if (returnedTracks[returnedTracks.length - 1] === 'eof') {
                        returnedTracks.pop();
                        resolve(returnedTracks);
                    }
                    else {
                        sourcePlaylistToObject(returnedTracks.length);
                    }
                }).catch((err) => {
                    reject(err);
                });
            };

            sourcePlaylistToObject();
        });
    }

    static setRemainingTracks(playlistData) {
        remainingTracks = playlistData;
    }
}

module.exports.SourcePlaylistReader = SourcePlaylistReader;

// Test use case and usage example
/*
SourcePlaylistReader.getSourcePlaylist('masterplaylist').then((data) => {
    console.log(data);
}).catch((err) => {
    console.log(err);
});
 */

