import React from "react"

import GameCard from "components/GameCard"

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
    player: object.isRequired
  },

  createNewGame (e) {
    const { firebase, player } = this.props
    e.preventDefault()

    const game = Game.gameNew(player)

    const gameRef = firebase.database().ref("games").push()
    gameRef.set(game).then(() => {
      navigate(`/games/${gameRef.key}`)
    })
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
    const { firebase, player } = this.props

    return (
      <div className="col s12 m6 l4" key={game._id}>
        <GameCard firebase={firebase} player={player} game={game} />
      </div>
    )
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
