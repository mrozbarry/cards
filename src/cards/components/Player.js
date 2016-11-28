import "./Player.css"

import React from "react"

const { object, bool, func } = React.PropTypes

// import { deckIdxToName } from "lib/card"

export default React.createClass({
  displayName: "Player",

  propTypes: {
    player: object.isRequired,
    stack: object,
    revealed: bool.isRequired,
    cards: object,

    dragStartFromHand: func.isRequired,
    dragEndFromHand: func.isRequired
  },

  dragStart (cardKey, e) {
    this.props.dragStartFromHand(cardKey, e)
  },

  dragEnd (cardKey, e) {
    this.props.dragEndFromHand(cardKey, e)
  },

  render () {
    const { player, cards } = this.props

    return (
      <div className="player">
        <div className="player-avatar" style={{ backgroundImage: "url(http://placehold.it/64x64)" }} />
        <div className="player-cards">
          {this.renderPlayerCards(player, cards)}
        </div>
      </div>
    )
  },

  renderPlayerCards (player, cards) {
    const cardStack = this.props.stack

    if (!cardStack) {
      return null
    }

    return cardStack.cards.map((cardKey, idx) => {
      // const card = cards[cardKey]

      if (this.props.revealed) {
        return (
          <img
            key={cardKey}
            className="player-card"
            //src={imageContext(`./cards/${card.suit}/${card.face}.png`)}
            onDragStart={this.dragStart.bind(this, cardKey)}
            onDragEnd={this.dragEnd.bind(this, cardKey)}
            style={{ zIndex: 100 - idx }}
            />
        )
      } else {
        return (
          <img
            key={cardKey}
            className="player-card"
            //src={imageContext(`./cards/Back/${deckIdxToName[card.deckIdx]}.png`)}
            style={{ zIndex: 100 - idx }}
            />
        )
      }
    })
  }
})
