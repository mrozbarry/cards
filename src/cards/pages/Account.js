import React from "react"

import AccountEdit from "components/AccountEdit"
import GameCard from "components/GameCard"

import GamesMixin from "mixins/GamesMixin"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "Account",

  mixins: [
    GamesMixin
  ],

  propTypes: {
    firebase: object.isRequired,
    currentUser: object.isRequired,
  },

  games () {
    const { currentUser } = this.props
    return this.state.games.filter((game) => game.ownerId === currentUser.uid)
  },

  render () {
    const accountGames = this.games()
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h1 className="white-text">Player Profile</h1>
          </div>
        </div>

        <div className="row">
          <div className="col s6">
            <AccountEdit
              firebase={this.props.firebase}
              currentUser={this.props.currentUser}
              />
          </div>
        </div>

        {this.renderGames(accountGames)}
      </div>
    )
  },

  renderGames (games) {
    if (games.length == 0) {
      return null
    }

    return (
      <div className="row">
        <div className="col s12">
          <h1 className="white-text">Your Games</h1>
        </div>
        {this.renderProfileGames(games)}
      </div>
    )
  },

  renderAccountGames (games) {
    const { firebase, currentUser } = this.props

    return games.map((game) => {
      return (
        <div key={game._id} className="col s12 m6 l4">
          <GameCard firebase={firebase} game={game} currentUser={currentUser} />
        </div>
      )
    })
  }
})
