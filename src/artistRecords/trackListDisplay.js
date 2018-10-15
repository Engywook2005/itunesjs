class TrackListDisplay {

    static listTracks(data) {
        for(let i = 0; i < data.length; i++) {
            const trackOnList =  {
                "trackID" : data[i]["Track ID"],
                "artist" : data[i]["Artist"],
                "name" : data[i]["Name"],
                "album" : data[i]["Album"],
                "playCount" : data[i]["Play Count"],
                "playDate" : data[i]["Play Date UTC"],
                "rating" : data[i]["Rating"]
            }
            console.log(i + ". " + JSON.stringify(trackOnList));
        }
    }
}

module.exports.TrackListDisplay = TrackListDisplay;