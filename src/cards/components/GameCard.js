/*
 * TODO:
 * An item can:
 * - Be dragged within the game container
 * - Be dropped within the game container
 * - Be held in your hand
 * - Be dragged out of hand
 */
import "./GameCard.css"
import React from "react"

const { object, string, bool, func } = React.PropTypes

export default React.createClass({
  displayName: "GameCard",

  propTypes: {
    firebase: object.isRequired,
    gameId: string.isRequired,
    cardId: string.isRequired,
    card: object,
    currentUser: object,
    interactive: bool.isRequired,
    getStorageUrl: func.isRequired,
    setHandCard: func.isRequired,
    isHandCard: bool.isRequired,
    flipCard: func.isRequired
  },


  getInitialState () {
    return {
      backUrl: null,
      faceUrl: null
    }
  },


  componentWillMount () {
    const { getStorageUrl, card } = this.props

    getStorageUrl(card.face, (url) => {
      this.setState({ faceUrl: url })
    })

    getStorageUrl(card.back, (url) => {
      this.setState({ backUrl: url })
    })
  },


  style () {
    const { card } = this.props
    const angle = parseInt(card.angle, 10)

    return {
      left: (card.position[0] - (card.size[0] / 2)) + "px",
      top: (card.position[1] - (card.size[1] / 2)) + "px",
      width: card.size[0] + "px",
      height: card.size[1] + "px",
      transform: `rotate(${angle}deg)`,
    }
  },


  cardClasses () {
    let classes = ["game-card__image"]
    if (this.props.interactive) {
      return classes.concat("game-card--interactive")
    } else {
      return classes
    }
  },


  cardStyle () {
    const { card } = this.props

    return {
      width: card.size[0] + "px",
      height: card.size[1] + "px"
    }
  },


  clearSetHandCardTimeout () {
    if (this.setHandCardTimeout) {
      clearTimeout(this.setHandCardTimeout)
      this.setHandCardTimeout = null
    }
  },


  handleMouseDown (e) {
    if (e.shiftKey) {
      e.preventDefault()
      return
    }

    e.preventDefault()
    if (this.props.interactive) {
      const mousePosition = { x: e.pageX, y: e.pageY }

      this.clearSetHandCardTimeout()

      this.setHandCardTimeout = setTimeout(() => {
        this.props.setHandCard(this.props.cardId, mousePosition)
        this.setHandCardTimeout = null
      }, 250)
    }
  },


  handleDoubleClick (e) {
    if (e.shiftKey) {
      return
    }

    e.preventDefault()
    if (this.props.interactive) {
      this.clearSetHandCardTimeout()
      this.props.flipCard(this.props.cardId)
    }
  },


  render () {
    const { card } = this.props
    const { faceUrl, backUrl } = this.state

    const source = card.faceUp ? faceUrl : backUrl

    return (
      <div className="game-card" style={this.style()}>
        <img
          className={this.cardClasses().join(" ")}
          src={source}
          alt={source}
          style={this.cardStyle()}
          onMouseDown={this.handleMouseDown}
          onDoubleClick={this.handleDoubleClick}
          />
      </div>
    )
  }
})
