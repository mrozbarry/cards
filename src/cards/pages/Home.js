import React from "react"

import GamesMixin from "GamesMixin"
import PlayersMixin from "PlayersMixin"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "Home",

  mixins: [
    GamesMixin,
    PlayersMixin
  ],

  propTypes: {
    firebase: object.isRequired,
    player: object
  },

  getActiveGamesCount () {
    return this.state.games.length
  },

  getOpenGamesCount () {
    return this.state.games.filter((game) => {
      return Object.keys(game.players || {}).length < game.maxPlayers
    }).length
  },

  getPlayersOnline () {
    return this.state.players.filter((player) => player.online).length
  },

  render () {
    return (
      <div>

        <div className="container">
          <div className="row">
            <div className="col s12">
              <h1 className="white-text">Welcome to Cards</h1>
              <p className="white-text">
                Cards is an online platform to play cards the way you and your friends want. We don't enforce rules, and just want you to have fun, your way.
              </p>
              {this.renderInstructions()}
            </div>
          </div>
          <div className="row">
            {this.renderCard("Active Games", this.getActiveGamesCount())}
            {this.renderCard("Open Games", this.getOpenGamesCount())}
            {this.renderCard("Players Online", this.getPlayersOnline())}
          </div>

          <div className="row">
            <div className="col s12">
            </div>
          </div>
        </div>
      </div>
    )
  },

  renderInstructions () {
    if (this.props.player) {
      return (
        <p className="white-text">
          Thanks for signing in! Check out the red gamepad icon for a games list, or the blue face icon for modifying your profile.
        </p>
      )
    } else {
      return (
        <p className="white-text">
          To get started, sign in using the <b>plus person</b> icon in the menu.  Worried about your personal data?  Just sign in anonymously!
        </p>
      )
    }
  },

  renderCard (title, number, color, textColor) {
    color = color || "teal"
    textColor = textColor || "white"

    const cardClasses = [
      "card-panel",
      color,
      `${textColor}-text`
    ].join(" ")

    return (
      <div className="col s12 m6 l4">
        <div className={cardClasses} style={{ textAlign: "center" }}>
          <h4>{title}</h4>
          <h2>{number}</h2>
        </div>
      </div>
    )
  }
})
