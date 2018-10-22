const osa = require('osa2')

class PlayerStateListener {
  constructor (responderCallback) {
    this.responderCallback = responderCallback
    this.currentPlayerState = null
  }

  // @TODO our playerStateResponder should accept an error argument on its responder callback.
  listenPlayerState () {
    const checkPlayerState = osa(() => {
      return Application('iTunes').playerState()
    })

    checkPlayerState().then((playerState) => {
      if (playerState === this.currentState) {
        setTimeout(() => {
          this.listenPlayerState()
        }, 100)
        return
      }
      this.currentState = playerState
      this.responderCallback(playerState)
    }).catch((err) => {
      console.log(err)

      // @TODO instead of exiting notify upstream, which should then (probably) exit.
      // e.g. this.responderCallback(err, null);
      process.exit()
    })
  }
}

module.exports.PlayerStateListener = PlayerStateListener

// REMOVE - testing
/*
const playerStateListener = new PlayerStateListener(function(playerState) {
    console.log(playerState);
    playerStateListener.listenPlayerState();
});

playerStateListener.listenPlayerState();
*/
