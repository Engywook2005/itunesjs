/* global module */
/* global require */

// @FIXME just plain weird that it has to be done this way.
const SourcePlaylistReader = require('./sourcePlaylistReader').SourcePlaylistReader;
const PlaylistFilterSorter = require('./playlistFilterSorter').PlaylistFilterSorter;

module.exports.SourcePlaylistReader = SourcePlaylistReader;
module.exports.PlaylistFilterSorter = PlaylistFilterSorter;
