#!/usr/bin/env osascript -l JavaScript


const iTunes = Application('iTunes');
const knownPlaylists = iTunes.sources["Library"].userPlaylists;
let tempPlaylist;

for(let prop in knownPlaylists) {
    if(knownPlaylists[prop].name() === 'tempUber') {
        tempPlaylist = knownPlaylists[prop];
    }
}

if(!tempPlaylist) {
  tempPlaylist = iTunes.UserPlaylist().make();
  tempPlaylist.name = 'tempUber';  
}

