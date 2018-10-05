var spawn = require('child_process').spawn;

class Queueing {
    constructor(trackStack) {
        this.trackStack = trackStack;
        if(this.trackStack.length === 0) {
            process.exit();
        }
    }

    addTrack() {
        const nextTrack = this.trackStack.shift(),
            nextTrackID = nextTrack["Track ID"];
        
        console.log(nextTrackID);    
    }
}

module.exports.Queueing = Queueing;