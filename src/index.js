/* global process */
/* global module */
/* global require */

const DisplayOutput = require('./output').DisplayOutput;
const LastPlayRecord = require('./trackRecords').LastPlayRecord;
const PlaylistFilterSorter = require('./playlistInterface').PlaylistFilterSorter;
const SourcePlaylistReader = require('./playlistInterface').SourcePlaylistReader;
const Queueing = require('./playback').Queueing;
const artistRecord = new LastPlayRecord('artistHistoryLogging');
const albumRecord = new LastPlayRecord('albumHistoryLogging');
const songTitleRecord = new LastPlayRecord('songTitleHistoryLogging');

const histories = {
    'artist': {
        class: artistRecord,
        search: 'artist'
    },
    'album': {
        class: albumRecord,
        search: 'album'
    },
    'songTitle': {
        class: songTitleRecord,
        search: 'name'
    }
};

/**
 * Pulls updated queue of tracks and appends the top of the queue to the
 * target playlist.
 *
 */
const addTrackToPlaylist = function () {
    getNextTrackStack().then(function (data) {
        if (data.length === 0) {
            DisplayOutput.simpleMessage('Queue is empty. Exiting.', 'Queue Status');
            process.exit();
        }
        const queueing = new Queueing(data);
        // @TODO queueing.addTrack will return a promise, indicating number of tracks left.
        // @TODO if paused, need to wait until playing to call queueing.addTrack. Otherwise weird things still happen when resuming.
        queueing.addTrack(true);
    }).catch((err) => {
        DisplayOutput.errorMessage(err);
        console.log(err);
        process.exit();
    });
};

/**
 * Assembles next tracks to play in desired order.
 *
 * @returns Promise
 */
const getNextTrackStack = function () {
    return new Promise(function (resolve, reject) {
        const parseCallback = function (playlist) {
            // Filter and sort playlist.
            const playlistFilterSorter = new PlaylistFilterSorter(histories);

            playlistFilterSorter.runSort(playlist).then(function (data) {
                DisplayOutput.listTracks(data, 'Tracks in queue:');
                resolve(data);
            }).catch((err) => {
                reject(err);
            });
        };

        // @TODO make configurable
        SourcePlaylistReader.getSourcePlaylist('masterplaylist').then((data) => {
            parseCallback(data);
        }).catch((err) => {
            reject(err);
        });
    });
};

/**
 * Initializes playback event capture (listening for change in track).
 *
 */
const init = function () {
    addTrackToPlaylist();
};

module.exports.init = init;
