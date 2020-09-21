/* global Application */
/* global module */
/* global require */

const osa = require('osa2');

class Queueing {
    constructor (trackStack = []) {
        this.trackStack = trackStack;
    }

    /**
     * Picks up top track from trackStack and adds to actual playlist.
     *
     * @returns {Array|*}
     */
    addTrack () {
        return new Promise((resolve) => {
            if (this.trackStack.length <= 0) {
                resolve([]);
            }

            const nextTrack = this.trackStack.shift();

            const dbID = nextTrack.trackID;

            this.findAndAddTrack(dbID).then(() => {
                console.log(`Adding next track: ${JSON.stringify(nextTrack)}`);

                resolve(nextTrack);
            });
        }).catch((error) => {
            throw error;
        });
    }

    /**
     * Receives id of selected track to add to playlist. Tells iTunes to find this track and add it to playlist.
     * Called by addTrack.
     * @param {*} dbID - ID of track iTunes should add to the playlist.
     */
    findAndAddTrack (dbID) {
        return new Promise((resolve, reject) => {
            const execAddTrack = osa((dbID) => {

                // @TODO configurable source and temp playlist names
                const knownPlaylists = Application('Music').sources['Library'].userPlaylists,
                    knownTracks = knownPlaylists.byName('masterplaylist').tracks;
                let trackToAdd, tempPlaylist;

                for (const prop in knownTracks) {
                    if (knownTracks[prop].databaseID() === dbID) {
                        console.log(`found by database id: ${ knownTracks[prop].name()}`);
                        trackToAdd = knownTracks[prop];
                        break;
                    }
                }

                if (!trackToAdd) {
                    return false;
                }

                for (const prop in knownPlaylists) {
                    if (knownPlaylists[prop].name() === 'itunesJSPlaylist') {
                        tempPlaylist = knownPlaylists[prop];
                    }
                }

                if (!tempPlaylist) {
                    tempPlaylist = Application('Music').UserPlaylist().make();
                    tempPlaylist.name = 'itunesJSPlaylist';
                }

                if (!tempPlaylist) {
                    return false;
                }

                trackToAdd.duplicate({ to: tempPlaylist });

                return true;
            });

            execAddTrack(dbID).then(function (data) {
                if (!data) {
                    reject(`failure to find target track: ${ dbID}`);
                }
                else {
                    resolve(data);
                }
            }).catch(
                function (error) {
                    reject(`error: ${ error}`);
                }
            );
        });

    }
}

module.exports.Queueing = Queueing;
