import React from "react"

import * as Game from "lib/game"
import * as Card from "lib/card"

import _ from "lodash"

const { object, string } = React.PropTypes

export default React.createClass({
  displayName: "GameEdit",

  propTypes: {
    firebase: object.isRequired,
    game: object.isRequired,
    gameId: string.isRequired
  },


  getInitialState () {
    return {
      deck: null
    }
  },


  componentDidMount () {
    this.deckRef = this.props.firebase.database().ref("decks").child("kennynl")
    this.deckRef.on("value", this.handleDeckValue)
  },


  componentWillUnmount () {
    this.deckRef.off("value", this.handleDeckValue)
  },


  handleDeckValue (snapshot) {
    const deck = snapshot.val()
    this.setState({ deck: deck })
  },


  gameNameChange (e) {
    const { firebase, gameId } = this.props

    Game.update(firebase, gameId, {
      name: e.target.value
    })
  },

  gameDescriptionChange (e) {
    const { firebase, gameId } = this.props

    Game.update(firebase, gameId, {
      description: e.target.value
    })
  },

  gameVisibleChange (e) {
    const { firebase, gameId } = this.props

    Game.update(firebase, gameId, {
      visible: e.target.checked
    })
  },

  gameCardsChange (e) {
    const { firebase, gameId, game } = this.props

    const delta = e.target.value - this.numberOfCards()

    if (delta > 0) {
      const { deck } = this.state
      Array.from(" ".repeat(delta)).forEach(() => {
        const backId = Object.keys(deck.backs)[0]
        const back = deck.backs[backId]

        const faceId = _.sample(Object.keys(deck.faces))
        const face = deck.faces[faceId]

        Game.addCard(
          firebase,
          gameId,
          Card.build({
            face: face,
            back: back,
            size: deck.size,
            position: [(Math.random() * 1900) + 10, (Math.random() * 1060) + 10, Object.keys(game.cards || {}).length],
            angle: Math.random() * 359,
            faceUp: (Math.random() * 30 > 15)
          })
        )
      })
    } else if (delta < 0) {
      const lastKeys = Object.keys(game.cards).slice(delta)
      lastKeys.forEach((cardId) => {
        Game.removeCard(firebase, gameId, cardId)
      })
    }
  },

  // gameAddDeck (e) {
  //   const { firebase, gameId, game } = this.props
  //
  //   e.preventDefault()
  //
  //   const deckRef = firebase.database().ref("decks").child("kennynl")
  //   deckRef.once("value", (snapshot) => {
  //     const deck = snapshot.val()
  //
  //     const backId = Object.keys(deck.backs)[0]
  //     const back = deck.backs[backId]
  //
  //     Object.keys(deck.faces).forEach((faceId) => {
  //       const face = deck.faces[faceId]
  //
  //       Game.addCard(
  //         firebase,
  //         gameId,
  //         Card.build({
  //           face: face,
  //           back: back,
  //           size: deck.size,
  //           position: [Math.random() * 600, Math.random() * 600, Object.keys(game.cards || {}).length],
  //           angle: Math.random() * 359,
  //           faceUp: (Math.random() * 30 > 15)
  //         })
  //       )
  //     })
  //   })
  // },

  numberOfCards () {
    const { game } = this.props

    return game ? Object.keys(game.cards || {}).length : 0
  },

  render () {
    const { game, gameId } = this.props

    const gameUrl = `/games/${gameId}`

    return (
      <div style={{ position: "fixed", left: "50%", width: "400px", marginLeft: "-200px", bottom: 0 }}>
        <div className="card">
          <div className="card-content">
            <div className="input-field">
              <input id="game-name" type="text" value={game.name || ""} onChange={this.gameNameChange} />
              <label htmlFor="game-name" className="active">Name of your game</label>
            </div>

            <div className="input-field">
              <textarea id="game-description" className="materialize-textarea" value={game.description || ""} onChange={this.gameDescriptionChange} />
              <label htmlFor="game-description" className="active">What game are you playing?</label>
            </div>

            {/*
            <div>
              <a href="#" className="waves-effect waves-light btn" onClick={this.gameAddDeck}>
                <i className="material-icons left">add</i>Card
              </a>
            </div>
            <br />
            */}

            <div>
              <label>Number of cards</label>
              <div className="range-field">
                <input type="range" value={this.numberOfCards()} min={0} max={300} onChange={this.gameCardsChange} />
              </div>
            </div>

            <hr />

            <div>
              <br />
              <input id="game-visible" type="checkbox" checked={game.visible} onChange={this.gameVisibleChange} />
              <label htmlFor="game-visible">Is this game visible?</label>
            </div>
          </div>
          <div className="card-action">
            <a className="btn waves-effect waves-light" href={gameUrl}>Done</a>
          </div>
        </div>
      </div>
    )
  }
})
