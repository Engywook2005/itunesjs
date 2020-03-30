/* global Application */
/* global module */
/* global process */
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
        if (this.trackStack.length <= 0) {
            return [];
        }

        const nextTrack = this.trackStack.shift();

        const dbID = nextTrack.trackID;

        this.findAndAddTrack(dbID);

        console.log(`Adding next track: ${ JSON.stringify(nextTrack) }`);

        return nextTrack;
    }

    /**
     * Receives id of selected track to add to playlist. Tells iTunes to find this track and add it to playlist.
     * Called by addTrack.
     * @param {*} dbID - ID of track iTunes should add to the playlist.
     */
    findAndAddTrack (dbID) {
        const execAddTrack = osa((dbID) => {

            // @TODO configurable source and temp playlist names
            const knownPlaylists = Application('iTunes').sources['Library'].userPlaylists;

            const knownTracks = knownPlaylists.byName('masterplaylist').tracks;
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
                tempPlaylist = Application('iTunes').UserPlaylist().make();
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
                console.log(`failure to find target track: ${ dbID}`);
                process.exit();
            }
        }).catch(
            function (error) {
                console.log(`error: ${ error}`);
                process.exit();
            }
        );
    }
}

module.exports.Queueing = Queueing;
