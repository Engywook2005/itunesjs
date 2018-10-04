
class Queueing {
    constructor(trackStack) {
        this.trackStack = trackStack;
        if(this.trackStack.length === 0) {
            process.exit();
        }
    }

    addTrack() {
        const nextTrack = this.trackStack.shift(),
            nextTrackObj = {
              "name": nextTrack.Name,
              "album": nextTrack.Album,
              "artist": nextTrack.Artist      
            },
            nextTrackArg = escape(JSON.stringify(nextTrackObj));
        
        console.log(nextTrackArg);    
    }
}

module.exports.Queueing = Queueing;