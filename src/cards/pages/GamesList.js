import React from "react"

import GamesListItem from "components/GamesListItem"

import * as Game from "lib/game"

import { navigate } from "react-mini-router"

import GamesMixin from "mixins/GamesMixin"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "GamesList",

  mixins: [
    GamesMixin
  ],

  propTypes: {
    firebase: object.isRequired,
    currentUser: object
  },

  createNewGame (e) {
    const { firebase, currentUser } = this.props
    e.preventDefault()

    const game = Game.build(currentUser)

    const gameRef =
      firebase
      .database()
      .ref("games")
      .push()

    gameRef.set(game).then(() => {
      navigate(`/games/${gameRef.key}/edit`)
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
    return this.state.games.filter((g) => {
      return Game.canSee(g, this.props.currentUser)
    }).map(this.renderGame)
  },

  renderGame (game) {
    const { firebase, currentUser } = this.props

    return (
      <div className="col s12 m6 l4" key={game._id}>
        <GamesListItem firebase={firebase} currentUser={currentUser} game={game} />
      </div>
    )
  },


  renderNewGame () {
    if (!this.props.currentUser) {
      return null
    }

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
  }
})
