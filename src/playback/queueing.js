const Application = require('jxa').Application;

class Queueing {
    constructor(trackStack) {
        this.trackStack = trackStack;
        this.iTunes = Application('iTunes');

        if(this.trackStack.length === 0) {
            process.exit();
        }
    }

    addTrack() {
        const nextTrack = this.trackStack.shift(),
          dbID = nextTrack["Track ID"],
          tempPlaylist = this.findPlaylist();
          return;

          trackToAdd = this.findTrack(dbID);
        
        if(trackToAdd && tempPlaylist) {
            this.addTrackToPlaylist(trackToAdd, tempPlaylist);
        }
        
        return tempPlaylist;
    }

    findPlaylist() {
        // @TODO make temp playlist name configurable
        const knownPlaylists = this.iTunes.sources["Library"].userPlaylists;

        console.log('listing known playlists');
        console.log(knownPlaylists);

        let tempPlaylist;

        for(let prop in knownPlaylists) {
            if(knownPlaylists[prop].name() === 'tempUber') {
                tempPlaylist = knownPlaylists[prop];
            }
        }
        
        if(!tempPlaylist) {
          tempPlaylist = this.iTunes.UserPlaylist().make();
          tempPlaylist.name = 'tempUber';  
        }

        return tempPlaylist;
    }

    findTrack(dbIB) {
      // @TODO make source playlist name configurable
      const knownTracks = this.iTunes.sources["Library"].userPlaylists.byName('masterplaylist').tracks; 
      let trackToAdd;
      
      // still would like to grab the track by database id in one go but this is better
      for(let prop in knownTracks) {
        if(knownTracks[prop].databaseID() === dbID) {
          console.log('found by database id: ' + knownTracks[prop].name());
          trackToAdd = knownTracks[prop];
        }
      }
      
      return trackToAdd;
    }
}

module.exports.Queueing = Queueing;