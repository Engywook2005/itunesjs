const fs = require('fs'),
    itunesData = require('itunes-data'),
    parser = itunesData.parser();


class TrackChooser {
    // @TODO will need to pass a callback function. At least one for when a track is chosen, perhaps another for when
    // they've all been sorted.
    constructor() {
        this.itunesLibrary = {};
        // @TODO this will need to be configurable. Also, pass as argument?
        // @TODO ugh this has to be full path, no ~ allowed?
        // expand-tilde may help here: https://www.npmjs.com/package/expand-tilde
        this.pathToLibary = "/Users/greg.thorson/Music/iTunes/iTunes\ Music\ Library.xml";
        this.stream = null;
        this.constructedPlaylist = {};
        this.allTracks = {};
    };

    readLibraryToJSON() {

        parser.on("playlist", function(playlist) {
            // @TODO - make configurable
            if(playlist.Name === 'masterplaylist') {
                for(let i = 0; i < playlist["Playlist Items"].length; i++) {
                    const newTrackRecord = {},
                        trackID = playlist["Playlist Items"][i]["Track ID"];
                    this.constructedPlaylist[trackID] = newTrackRecord;
                }
                //console.log(this.constructedPlaylist);
            };            
        }.bind(this));

        this.stream = fs.createReadStream(this.pathToLibary);

        this.stream.pipe(parser);
    }
}

const trackChooser = new TrackChooser();
trackChooser.readLibraryToJSON();

//@TODO remove!!!