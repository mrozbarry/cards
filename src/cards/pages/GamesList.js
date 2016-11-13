import React from "react"

import * as Game from "lib/game"

import { navigate } from "react-mini-router"

import GamesMixin from "GamesMixin"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "GamesList",

  mixins: [
    GamesMixin
  ],

  propTypes: {
    firebase: object.isRequired,
    player: object
  },

  createNewGame (e) {
    const { firebase, player } = this.props
    e.preventDefault()

    const game = Game.gameNew(player)

    const gameRef = firebase.database().ref("games").push()
    gameRef.set(game).then(() => {
      navigate(`/games/${gameRef.key}/edit`)
    })
  },

  deleteGame (game, e) {
    const { firebase } = this.props

    e.preventDefault()

    firebase.database().ref("games").child(game._id).remove()
  },

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h1 className="white-text">Card Games</h1>
          </div>
        </div>

        <div className="row">
          {this.renderGames()}
          {this.renderNewGame()}
        </div>
      </div>
    )
  },

  renderGames () {
    return this.state.games.map(this.renderGame)
  },

  renderGame (game) {
    const numberOfPlayers = game.players ? Object.keys(game.players || {}).length : 0
    return (
      <div className="col s12 m6 l4" key={game._id}>
        <div className="card teal darken-2">
          <div className="card-content white-text" style={{ height: "300px"}}>
            <h3>{game.name}</h3>
            <div className="truncate">
              {numberOfPlayers} / {game.maxPlayers}
            </div>
          </div>
          {this.renderGameActions(game)}
        </div>
      </div>
    )
  },

  renderGameActions (game) {
    const numberOfPlayers = game.players ? Object.keys(game.players || {}).length : 0
    if (numberOfPlayers < game.maxPlayers) {
      const { player } = this.props
      const gameUrl = `/games/${game._id}`

      let anchors = [
        <a key="join" href={gameUrl}>Join Game</a>
      ]

      if (player && game.ownerId === player.userId) {
        anchors.push(
          <a key="delete" href="#" onClick={this.deleteGame.bind(this, game)}>Delete Game</a>
        )
      }

      return (
        <div className="card-action">
          {anchors}
        </div>
      )
    } else {
      return null
    }
  },

  renderNewGame () {
    if (this.props.player) {
      return (
        <div className="col s12 m6 l4" key="new">
          <div className="card teal darken-3">
            <div className="card-content white-text" style={{ height: "300px"}}>
              <h3>Create a new game</h3>
              <p>
                Take control and create a new game. Share the link with friends and play the way you want!
              </p>
            </div>
            <div className="card-action">
              <a href="#" onClick={this.createNewGame}>Create Game</a>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
})
