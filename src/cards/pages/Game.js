import React from "react"

import { navigate } from "react-mini-router"

const { object, string, bool } = React.PropTypes

export default React.createClass({
  displayName: "Game",

  propTypes: {
    firebase: object.isRequired,
    gameId: string.isRequired,
    player: object,
    editMode: bool
  },

  getInitialState () {
    return {
      game: null
    }
  },

  componentWillMount () {
    const { firebase, gameId } = this.props

    this.gameRef = firebase.database().ref("games").child(gameId)
    this.gameRef.on("value", this.gameValueChange)
  },

  componentDidMount () {
    this.pinger = setInterval(() => {
      this.sendPing()
    }, 2000)

    this.sendPing()
  },

  componentWillUnmount () {
    clearInterval(this.pinger)

    this.gameRef.off("value", this.gameValueChange)
  },

  gameValueChange (snapshot) {
    const game = snapshot.val()

    if (!game) {
      navigate("/games")

    } else {
      this.setState({
        game: game
      }, () => {
      })
    }
  },

  sendPing () {
    // const { player } = this.props
    //
    // if (player) {
    //   const { players } = Game.gamePingPlayer(this.state.game, player)
    //
    //   console.log("Ping", this.state.game.players, players)
    //   this.gameRef.child("players").set(players)
    // }
  },

  render () {
    return (
      <div>
        <svg ref={(ele) => this.svg = ele} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%", backgroundColor: "#f0f" }} xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet">
        </svg>
      </div>
    )
  }
})
