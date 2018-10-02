const EventCapture = require('./playbackEvents').EventCapture;
const LastPlayByArtist = require('./artistRecords').LastPlayByArtist;
const PlaylistParser = require('./playlistInterface').PlaylistParser;
const PlaylistFilterSorter = require('./playlistInterface').PlaylistFilterSorter;

// @TODO the actual executable should be here in src/index.js. The only thing in index.js should be an IIFE that calls a main function here.

module.exports.EventCapture = EventCapture;
module.exports.LastPlayByArtist = LastPlayByArtist;
module.exports.PlaylistParser = PlaylistParser;
module.exports.PlaylistFilterSorter = PlaylistFilterSorter;