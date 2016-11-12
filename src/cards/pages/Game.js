import React from "react"

import * as Game from "lib/game"

const { object, string } = React.PropTypes

export default React.createClass({
  displayName: "Game",

  propTypes: {
    firebase: object.isRequired,
    gameId: string.isRequired
  },

  getInitialState () {
    return {
      game: Game.gameNew({ isAnonymous: true, displayName: "Unknown" }),
      waitingOnFirstValue: true
    }
  },

  componentWillMount () {
    const { firebase, gameId } = this.props

    this.gameRef = firebase.database().ref("games").child(gameId)
    this.gameRef.on("value", this.gameValueChange)
  },

  componentDidMount () {
    const { currentUser } = this.props.firebase.auth()

    if (currentUser) {
      console.log("Setting up pinger")
      this.pinger = setInterval(() => {
        this.sendPing(currentUser)
      }, 2000)
      this.sendPing(currentUser)
    }
  },

  componentWillUnmount () {
    if (this.pinger) {
      clearInterval(this.pinger)
      this.pinger = null
    }
    this.gameRef.off("value", this.gameValueChange)
  },

  gameValueChange (snapshot) {
    const { firebase } = this.props

    this.setState({
      game: snapshot.val(),
      waitingOnFirstValue: false
    }, () => {
      const { game } = this.state
      const { currentUser } = firebase.auth()

      if (!currentUser) {
        return
      }

      if (!game || Game.gameIsAbandoned(game)) {
        console.log("There is no game, should we create one?")
        this.gameRef.update(Game.gameNew(currentUser))
      } else {
        const player = Game.gameGetPlayer(game, currentUser)
        if (!player) {
          this.gameRef.child("players").update(
            Game.gameAddPlayer(game, currentUser).players
          )
        }
      }
    })
  },

  sendPing (user) {
    const { players } = Game.gamePingPlayer(this.state.game, user)

    console.log("Ping", this.state.game.players, players)
    this.gameRef.child("players").set(players)
  },

  render () {
    return (
      <div>
        <canvas>No canvas support :(</canvas>
      </div>
    )
  }
})
