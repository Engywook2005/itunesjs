const osa = require('osa2');

class Queueing {
    constructor (trackStack = []) {
        this.trackStack = trackStack;
    }

    // @TODO via promises. Send back up to index.js.
    /**
     * Finds next track to play from the queue and passes on to findAndAddTrack.
     * @param {Boolean} startPlayback - If true, begin playing automatically.
     * @param {Object} currentTrack - used to verify that the next track isn't the one that's already playing.
     */
    addTrack (startPlayback, currentTrack = null) {
        if (this.trackStack.length <= 0) {
            return [];
        }

        let nextTrack = this.trackStack.shift();

        try {
            if (currentTrack && nextTrack.dbID === currentTrack.dbID) {
                nextTrack = this.trackStack.shift();
            }
        }
        catch (err) {
            return [];
        }

        const dbID = nextTrack.trackID;

        this.findAndAddTrack(dbID, startPlayback);

        return this.trackStack;
    }

    /**
     * Receives id of selected track to add to playlist. Tells iTunes to find this track and add it to playlist.
     * Called by addTrack.
     * @param {*} dbID - ID of track iTunes should add to the playlist.
     * @param {*} startPlayback - If true, begin playing automatically.
     */
    findAndAddTrack (dbID, startPlayback) {
    // @TODO An issue that most likely will require a change to OSA library: if you can't represent an argument as JSON,
    // you can't pass it in as an argument. Same goes for return values, so tracks and playlists can't be returned intact
    // from the function. This does mean that the osa call must be self-contained and that I have to repeat myself a lot.
        const execAddTrack = osa((dbID, startPlayback) => {
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
                if (knownPlaylists[prop].name() === 'tempUber') {
                    tempPlaylist = knownPlaylists[prop];
                }
            }

            if (!tempPlaylist) {
                tempPlaylist = Application('iTunes').UserPlaylist().make();
                tempPlaylist.name = 'tempUber';
            }

            if (!tempPlaylist) {
                return false;
            }

            trackToAdd.duplicate({ to: tempPlaylist });

            if (startPlayback && Application('iTunes').playerState() !== 'playing') {
                tempPlaylist.play();
            }

            return true;
        });

        // @TODO handle failure outside of this class. Should findAndAddTrack should itself
        // return a promise.
        execAddTrack(dbID, startPlayback).then(function (data) {
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
