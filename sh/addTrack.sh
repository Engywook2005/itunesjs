#!/usr/bin/env osascript -l JavaScript


const iTunes = Application('iTunes');
const knownPlaylists = iTunes.sources["Library"].userPlaylists;
// @TODO need to make the track id settable by argument.
const targetTrackName = "Is There Anybody Out There?";
let tempPlaylist, trackToAdd;

for(let prop in knownPlaylists) {
    if(knownPlaylists[prop].name() === 'tempUber') {
        tempPlaylist = knownPlaylists[prop];
    }
}

if(!tempPlaylist) {
  tempPlaylist = iTunes.UserPlaylist().make();
  tempPlaylist.name = 'tempUber';  
}

//console.log(iTunes.sources["Library"].tracks[trackToAdd].name());

//iTunes.sources["Library"].tracks.byId(trackToAdd).name();

// @TODO no way this is the only way to do this
// @TODO make this configurable as well
const knownTracks = iTunes.sources["Library"].userPlaylists.byName('masterplaylist').tracks;

for(let prop in knownTracks) {
    //console.log(prop + " " + knownTracks[prop].track_id());
    //console.log(prop + " " + knownTracks[prop].name() + " " + knownTracks[prop].artist() + " " + knownTracks[prop].album());
    if(knownTracks[prop].name() === targetTrackName) {
        console.log('found it');
        trackToAdd = knownTracks[prop];
        break;
    }
}

trackToAdd.duplicate({to:tempPlaylist});

