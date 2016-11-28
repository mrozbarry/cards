/*
 * TODO:
 * An item can:
 * - Be dragged within the game container
 * - Be dropped within the game container
 * - Be held in your hand
 * - Be dragged out of hand
 */
import React from "react"

const { object, string, bool } = React.PropTypes

export default React.createClass({
  displayName: "GameCard",

  propTypes: {
    firebase: object.isRequired,
    gameId: string.isRequired,
    cardId: string.isRequired,
    card: object,
    currentUser: object.isRequired,
    interactive: bool.isRequired
  },

  style () {
    const { card } = this.props
    const extra = card.position[2] / 10
    const shadowBlur = card.position[2] * 5
    return {
      position: "absolute",
      left: (card.position[0] + extra) + "px",
      top: (card.position[1] + extra) + "px",
      width: card.size[0] + "px",
      height: card.size[1] + "px",
      borderRadius: "5px",
      backgroundColor: card.colour,
      transformOrigin: "50% 50%",
      transform: `rotate(${card.angle}deg)`,
      boxShadow: `0 0 ${shadowBlur}px 0 black`
    }
  },

  render () {
    return (
      <div
        style={this.style()}
        />
    )
  }
})
