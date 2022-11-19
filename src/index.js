/* global process */
/* global module */
/* global require */

const DisplayOutput = require('./output').DisplayOutput;
const LastPlayRecord = require('./trackRecords').LastPlayRecord;
const PlaylistFilterSorter =
  require('./playlistInterface').PlaylistFilterSorter;
const SourcePlaylistReader =
  require('./playlistInterface').SourcePlaylistReader;
const Queueing = require('./playback').Queueing;
const artistRecord = new LastPlayRecord();
const albumRecord = new LastPlayRecord();
const songTitleRecord = new LastPlayRecord();

// test change again

const histories = {
  artist: {
    class: artistRecord,
    search: 'artist'
  },
  album: {
    class: albumRecord,
    search: 'album'
  },
  songTitle: {
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
  getNextTrackStack()
    .then(function (data) {
      if (data.length === 0) {
        DisplayOutput.simpleMessage('Queue is empty. Exiting.', 'Queue Status');
        process.exit();
      }
      const queueing = new Queueing(data);

      queueing
        .addTrack()
        .then((nextTrack) => {
          // Don't play anything with same artist, album, or title as what we just played.
          updateHistories(nextTrack);

          // Keep going until we're out of tracks.
          addTrackToPlaylist();
        })
        .catch((err) => {
          console.log(err);
          process.exit();
        });
    })
    .catch((err) => {
      DisplayOutput.errorMessage(err);
      console.log(err);
      process.exit();
    });
};

const updateHistories = function (trackData) {
  const histSet = Object.keys(histories),
    histSetLength = histSet.length;

  for (let i = 0; i < histSetLength; i++) {
    const record = histories[histSet[i]];

    record.class.updatePlaybackHistory(trackData[record.search]);
  }
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

      playlistFilterSorter
        .runSort(playlist)
        .then(function (data) {
          DisplayOutput.listTracks(data, 'Tracks in queue:');
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    };

    SourcePlaylistReader.getSourcePlaylist('masterplaylist')
      .then((data) => {
        parseCallback(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

/**
 * Initializes playback event capture (listening for change in track).
 *
 */
const init = function () {
  console.log('init');

  addTrackToPlaylist();
};

module.exports.init = init;
