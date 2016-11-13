import "./Game.css"

import React from "react"

import GameChat from "components/GameChat"

import { navigate } from "react-mini-router"

import _ from "lodash"

const { object, string, bool } = React.PropTypes

const imageContext = require.context("assets/", true, /\.png$/)

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
      game: null,
      players: null,
      gameTextShow: false
    }
  },

  componentWillMount () {
    const { firebase, gameId, player } = this.props

    this.gameRef = firebase.database().ref("games").child(gameId)
    this.gameRef.on("value", this.gameValueChange)

    this.playersRef = firebase.database().ref("players")
    this.playersRef.on("value", this.playersValueChange)

    this.playerRef = this.gameRef.child("players").child(player.userId)

    this.playerRef.set({
      position: [0, 0],
      visible: false
    })

    this.submitMousePosition = _.throttle((position) => {
      this.playerRef.update({
        position: ["x", "y"].map((axis) => parseInt(position[axis])),
        visible: true
      })
    }, 50)
  },

  componentWillUnmount () {
    const { player } = this.props

    this.gameRef.off("value", this.gameValueChange)
    this.gameRef.child("players").child(player.userId).remove()
  },

  gameValueChange (snapshot) {
    const game = snapshot.val()

    if (!game) {
      navigate("/")

    } else {
      this.setState({
        game: game
      })
    }
  },

  playersValueChange (snapshot) {
    this.setState({
      players: snapshot.val()
    })
  },

  toggleGameText (show) {
    this.setState({
      gameTextShow: show
    })
  },

  mouseMove (e) {
    let point = this.svg.createSVGPoint()
    point.x = e.clientX
    point.y = e.clientY
    this.submitMousePosition(point.matrixTransform(this.svg.getScreenCTM().inverse()))
  },

  say (message) {
    this.gameRef.child("messages").push({
      userId: this.props.player.userId,
      type: "say",
      message: message,
      createdAt: Date.now()
    })
  },

  notify (notification) {
    this.gameRef.child("messages").push({
      userId: this.props.player.userId,
      type: "notify",
      message: notification,
      createdAt: Date.now()
    })
  },

  render () {
    return (
      <div className="game">
        <svg ref={(ele) => this.svg = ele} className="game-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" onMouseMove={this.mouseMove}>
          <rect x="0" y="0" width="1920" height="1080" fill="#076324" />
          {this.renderCursors()}
        </svg>

        {this.renderGameTitle()}

        <GameChat firebase={this.props.firebase} game={this.state.game} players={this.state.players} say={this.say} toggleGameText={this.toggleGameText} />
      </div>
    )
  },

  renderGameTitle () {
    const { game, gameTextShow } = this.state

    if (gameTextShow) {
      return (
        <div className="game-text">
          <h2>{game.name}</h2>
          <div>{game.description}</div>
        </div>
      )
    } else {
      return null
    }
  },

  renderCursors () {
    const { player } = this.props
    const { game, players } = this.state

    return Object.keys(game.players || {}).map((playerKey) => {
      const cursorPlayer = game.players[playerKey]
      if (cursorPlayer.position) {
        const [x, y] = cursorPlayer.position

        const name = playerKey == player.userId ? "You" : players[playerKey].name

        return (
          <g key={playerKey} style={{ zIndex: playerKey == player.userId ? 999 : undefined }}>
            <text x={x} y={y - 10} textAnchor="start" style={{ transition: "all 0.1s ease" }}>{name}</text>
            <image href={imageContext("./cursor.png")} x={x - 28} y={y} width={64} height={101} style={{ transition: "all 0.05s ease" }} />
          </g>
        )
      } else {
        return null
      }
    })
  }
})
