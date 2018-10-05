#!/usr/bin/env osascript -l JavaScript

const dbID = parseInt($.NSProcessInfo.processInfo.arguments.objectAtIndex(4).js);
 
const iTunes = Application('iTunes');
const knownPlaylists = iTunes.sources["Library"].userPlaylists;

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

const knownTracks = iTunes.sources["Library"].userPlaylists.byName('masterplaylist').tracks;

// still would like to grab the track by database id in one go but this is better
for(let prop in knownTracks) {
    if(knownTracks[prop].databaseID() === dbID) {
        console.log('found by database id: ' + knownTracks[prop].name());
        trackToAdd = knownTracks[prop];
    }
}

trackToAdd.duplicate({to:tempPlaylist});

// Switch to playlist and play it then would you
if(iTunes.playerState() !== 'playing') {
    tempPlaylist.play();
}
