class TrackListDisplay {
  // @TODO when a web form message will indicate target element on page to receive the message
  static listTracks (data, message = null) {
    if (message) {
      console.log('*** ' + message + ' ***')
    }

    for (let i = 0; i < data.length; i++) {
      const trackOnList = {
        'trackID': data[i].trackID,
        'artist': data[i].artist,
        'name': data[i].name,
        'album': data[i].album,
        'playCount': data[i].playCount,
        'lastPlayed': data[i].lastPlayed,
        'rating': data[i].rating
      }
      console.log((i + 1) + '. ' + JSON.stringify(trackOnList))
    }
  }
}

module.exports.TrackListDisplay = TrackListDisplay
