#!/usr/bin/env osascript -l JavaScript

// .sh/addTrack.sh [stringified, then escaped object]
const nameArtistAlbumString = $.NSProcessInfo.processInfo.arguments.objectAtIndex(4).js;
    nameArtistAlbumObj = JSON.parse(unescape(nameArtistAlbumString));
 
const iTunes = Application('iTunes');
const knownPlaylists = iTunes.sources["Library"].userPlaylists;

const trackName = nameArtistAlbumObj.name;
const artist = nameArtistAlbumObj.artist;
const album = nameArtistAlbumObj.album;

console.log(trackName);
console.log(artist);
console.log(album);

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

// @TODO no way this is the only way to do this
const knownTracks = iTunes.sources["Library"].userPlaylists.byName('masterplaylist').tracks;

for(let prop in knownTracks) {
    //console.log(prop + " " + knownTracks[prop].track_id());
    //console.log(prop + " " + knownTracks[prop].name() + " " + knownTracks[prop].artist() + " " + knownTracks[prop].album());
    if(knownTracks[prop].name() === trackName && knownTracks[prop].artist() === artist && knownTracks[prop].album() === album) {
        console.log('found it');
        trackToAdd = knownTracks[prop];
        break;
    }
}

trackToAdd.duplicate({to:tempPlaylist});