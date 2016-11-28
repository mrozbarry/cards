import "./Game.css"

import React from "react"

import GameCard from "components/GameCard"
import GameChat from "components/GameChat"
import GameEdit from "components/GameEdit"
import Player from "components/Player"

import PlayersMixin from "mixins/PlayersMixin"

import { navigate } from "react-mini-router"

import _ from "lodash"

const { func, object, string, bool } = React.PropTypes

// const imageContext = require.context("assets/", true, /\.png$/)

const CARD_SCALE = 0.7
const CARD_WIDTH = 255 * CARD_SCALE
const CARD_HEIGHT = 380 * CARD_SCALE

export default React.createClass({
  displayName: "Game",

  propTypes: {
    setCurrentGameKey: func.isRequired,

    firebase: object.isRequired,
    gameId: string.isRequired,
    currentUser: object,
    editMode: bool
  },

  mixins: [
    PlayersMixin
  ],

  getInitialState () {
    return {
      game: null,
      gameTextShow: false,
      heldStackKey: null
    }
  },

  componentWillMount () {
    const { firebase, gameId } = this.props

    this.gameRef = firebase.database().ref("games").child(gameId)
    this.gameRef.on("value", this.gameValueChange)

    // this.playerRef = this.gameRef.child("players").child(currentUser.uid)
    //
    // this.playerRef.set({
    //   userId: currentUser.uid,
    //   position: [0, 0]
    // })

    //document.addEventListener("mouseup", this.endMoveStack)

    // this.submitMousePosition = (position) => {
    //   this.playerRef.update({
    //     position: [position.x, position.y]
    //   })
    // }

    this.props.setCurrentGameKey(this.props.gameId)
  },

  componentWillUnmount () {
    this.gameRef.off("value", this.gameValueChange)
    this.props.setCurrentGameKey(null)
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

  toggleGameText (show) {
    this.setState({
      gameTextShow: show
    })
  },

  clientToSvgCoord ({ clientX, clientY }) {
    let point = this.svg.createSVGPoint()
    point.x = clientX
    point.y = clientY
    return point.matrixTransform(this.svg.getScreenCTM().inverse())
  },

  mouseMove (e) {
    this.moveHeldStackKey(e)
    //this.submitMousePosition(this.clientToSvgCoord(e))
  },

  moveHeldStackKey (e) {
    const { heldStackKey } = this.state

    if (heldStackKey) {
      let nextPosition = this.clientToSvgCoord(e)
      nextPosition.x = Math.max(0, nextPosition.x)
      nextPosition.x = Math.min(1920 - CARD_WIDTH, nextPosition.x)
      nextPosition.y = Math.max(0, nextPosition.y)
      nextPosition.y = Math.min(1080 - CARD_HEIGHT, nextPosition.y)

      this
        .gameRef
        .child("stacks")
        .child(heldStackKey)
        .child("position")
        .set([nextPosition.x, nextPosition.y])
    }
  },

  say (message) {
    const { currentUser } = this.props

    this.gameRef.child("messages").push({
      userId: currentUser.uid,
      type: "say",
      message: message,
      createdAt: Date.now()
    })
  },

  takeTopCard (stackKey, e) {
    if (e) {
      e.preventDefault()
    }
    this.stackTakeFromTop(stackKey)
  },

  dragStartFromHand (stackKey, cardKey, e) {
    e.dataTransfer.setData("text", JSON.stringify({
      stackKey: stackKey,
      cardKey: cardKey
    }))
  },

  dragEndFromHand (stackKey, cardKey, e) {
    if (e.dataTransfer.dropEffect == "none") {
      e.preventDefault()
      return
    }

    const nextStackCards = this.state.game.stacks[stackKey].cards.filter((ck) => ck != cardKey)
    if (nextStackCards.length > 0) {
      this.gameRef.child("stacks").child(stackKey).child("cards").set(nextStackCards)
    } else {
      this.gameRef.child("stacks").child(stackKey).remove()
    }
  },

  // ------------

  dragOverTable (e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  },

  dropOntoTable (e) {
    const source = JSON.parse(e.dataTransfer.getData("text"))
    const svgPosition = this.clientToSvgCoord(e)
    if (source.cardKey) {
      const ref = this.gameRef.child("stacks").push()
      ref.set({
        _id: ref.key,
        position: [svgPosition.x, svgPosition.y],
        cards: [source.cardKey],
        ownedBy: false,
        faceUp: false
      })
    } else {
      this.gameRef
        .child("stacks")
        .child(source.stackKey)
        .child("position")
        .set([svgPosition.x, svgPosition.y])
    }
  },

  // ------------

  dragOverStack (stackKey, e) {
    if (e.preventDefault) {
      e.preventDefault()
    }
    e.dataTransfer.dropEffect = "move"
  },

  dropOntoStack (destStackKey, e) {
    const source = JSON.parse(e.dataTransfer.getData("text"))
    if (source.cardKey) {
      const nextStackCards = this.state.game.stacks[destStackKey].cards.concat(source.cardKey)
      this.gameRef.child("stacks").child(destStackKey).child("cards").set(nextStackCards)
    } else {
      const sourceCards = this.state.game.stacks[source.stackKey].cards
      const nextStackCards = this.state.game.stacks[destStackKey].cards.concat(sourceCards)
      this.gameRef.child("stacks").child(destStackKey).child("cards").set(nextStackCards)
    }
  },

  // ------------

  beginMoveStack (stackKey, e) {
    if (e.button != 0) {
      return
    }

    e.preventDefault()
    console.log("beginMoveStack", stackKey)
    this.setState({
      heldStackKey: stackKey
    })
  },

  endMoveStack (e) {
    console.log("mouseUp")
    const { heldStackKey } = this.state
    if (heldStackKey) {
      e.preventDefault()
      this.setState({
        heldStackKey: null
      })
    }
  },

  // ------------

  stackTakeFromTop (stackKey) {
    const { currentUser } = this.props
    const { game } = this.state
    const stack = game.stacks[stackKey]
    const nextStackCards = stack.cards.slice(0, -1)
    const myCard = _.last(game.stacks[stackKey].cards)

    if (nextStackCards.length > 0) {
      this.gameRef.child("stacks").child(stackKey).child("cards").set(nextStackCards)
    } else {
      this.gameRef.child("stacks").child(stackKey).remove()
    }

    const myStackKey = _.findKey(game.stacks, (gStack) => {
      return gStack.ownedBy == currentUser.uid
    })

    if (myStackKey) {
      const myNextCards = game.stacks[myStackKey].cards.concat(myCard)
      this.gameRef.child("stacks").child(myStackKey).child("cards").set(myNextCards)
    } else {
      const ref = this.gameRef.child("stacks").push()
      ref.set({
        _id: ref.key,
        position: [0, 0],
        cards: [myCard],
        ownedBy: currentUser.uid,
        faceUp: false
      })
    }
  },

  cardOverlapCount (layeredCards, card) {
    return layeredCards.filter((layeredCard) => {
      const left = card.position[0] < (layeredCard.position[0] + layeredCard.size[0])
      const right = (card.position[0] + card.size[0]) > layeredCard.position[0]
      const top = card.position[1] < (layeredCard.position[1] + layeredCard.size[1])
      const bottom = (card.position[1] + card.size[1]) > layeredCard.position[1]
      return left && right && top && bottom
    }).length
  },

  cardsWithZ () {
    const { game } = this.state

    if (!game) {
      return []
    }

    let layeredCards = []

    Object.keys(game.cards || {}).forEach((cardId) => {
      const card = game.cards[cardId]

      const zIndex = this.cardOverlapCount(layeredCards, card)

      const nextCard = Object.assign({}, card, {
        _id: cardId,
        position: card.position.concat(zIndex + 1)
      })

      layeredCards.push(nextCard)
    })

    return layeredCards
  },

  render () {
    return (
      <div className="game">
        <div className="game-board">
          {this.renderCards()}
        </div>
        {/*
        <svg ref={(ele) => this.svg = ele} className="game-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" onMouseMove={this.mouseMove}>
          <rect x="0" y="0" width="1920" height="1080" fill="#076324" onDragOver={this.dragOverTable} onDrop={this.dropOntoTable} />
          {this.renderStacks()}
          {this.renderCursors()}
        </svg>

        {this.renderGameTitle()}
        */}

        <GameChat firebase={this.props.firebase} game={this.state.game} players={this.state.players} say={this.say} toggleGameText={this.toggleGameText} />
        <div className="game-player-list">
          {/*this.renderPlayers()*/}
        </div>
        {this.renderEdit()}
      </div>
    )
  },

  renderCards () {
    const { firebase, gameId, currentUser } = this.props

    const cards = _.sortBy(this.cardsWithZ(), (card) => card.position[2])

    console.log("Cards:", cards)

    return cards.map((card) => {
      return (
        <GameCard
          key={card._id}
          firebase={firebase}
          gameId={gameId}
          cardId={card._id}
          card={card}
          currentUser={currentUser}
          interactive={false}
          />
      )
    })
  },

  renderEdit () {
    const { firebase, gameId } = this.props
    const { game } = this.state

    if (game && this.props.editMode) {
      return (
        <GameEdit
          firebase={firebase}
          gameId={gameId}
          game={game}
          />
      )
    } else {
      return null
    }
  },

  renderGameTitle () {
    const { game, gameTextShow } = this.state

    if (!game) {
      return null
    }

    if (gameTextShow || this.props.editMode) {
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

  renderPlayers () {
    const { game } = this.state

    if (!game) {
      return null
    }

    return Object.keys(game.players || {}).map((playerKey) => {
      const stackKey = _.findKey(game.stacks || {}, (s) => {
        return s.ownedBy == playerKey
      })

      return (
        <Player
          key={playerKey}
          player={game.players[playerKey]}
          stack={game.stacks[stackKey]}
          revealed={playerKey === this.props.currentUser.uid}
          cards={game.cards}
          dragStartFromHand={this.dragStartFromHand.bind(this, stackKey)}
          dragEndFromHand={this.dragEndFromHand.bind(this, stackKey)}
          />
      )
    })
  },


  renderStacks () {
    const { game } = this.state

    if (!game) {
      return
    }

    const { stacks } = game

    return Object.keys(stacks || {}).map((stackKey) => {
      const stack = stacks[stackKey]
      if (stack.ownedBy == false) {
        //const lastCard = game.cards[_.last(stack.cards)]
        const imageHref = "#" //stack.faceUp ? imageContext(`./cards/${lastCard.suit}/${lastCard.face}.png`) : imageContext(`./cards/Back/${deckIdxToName[lastCard.deckIdx]}.png`)
        const [x, y] = stack.position

        return (
          <image
            key={stackKey}
            className="game-stack"
            xlinkHref={imageHref}
            width={CARD_WIDTH}
            height={CARD_HEIGHT}
            x={x}
            y={y}
            onDoubleClick={this.takeTopCard.bind(this, stackKey)}
            onDragOver={this.dragOverStack.bind(this, stackKey)}
            onDrop={this.dropOntoStack.bind(this, stackKey)}
            onMouseDown={this.beginMoveStack.bind(this, stackKey)}
            />
        )

      } else {
        return null
      }
    })
  },

  renderCursors () {
    const game = this.state.game

    if (!game) {
      return null
    }

    return Object.keys(game.players || {}).map((playerKey) => {
      const player = game.players[playerKey]
      if (player) {
        let position = {
          x: player.position[0] - 28,
          y: player.position[1] + 5
        }

        position.x = Math.min(1920, Math.max(0, position.x))
        position.y = Math.min(1080, Math.max(0, position.y))

        return (
          <image
            key={playerKey}
            //href={imageContext("./cursor.png")}
            x={position.x}
            y={position.y}
            width={64}
            height={101}
            style={{ transition: "all 0.05s ease", pointerEvents: "none" }}
            />
        )
      } else {
        return null
      }
    })
  }
})
