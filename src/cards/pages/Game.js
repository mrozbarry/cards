import "./Game.css"

import React from "react"

import GameCard from "components/GameCard"
import GameChat from "components/GameChat"
import GameEdit from "components/GameEdit"

import { navigate } from "react-mini-router"

import _ from "lodash"

const { func, object, string, bool } = React.PropTypes

export default React.createClass({
  displayName: "Game",

  propTypes: {
    setCurrentGameKey: func.isRequired,

    firebase: object.isRequired,
    gameId: string.isRequired,
    currentUser: object,
    editMode: bool
  },

  getInitialState () {
    return {
      game: null,
      hand: null,
      select: null
    }
  },


  setHandCard (cardId, mousePosition) {
    const { game } = this.state

    const center = {
      x: game.cards[cardId].position[0],
      y: game.cards[cardId].position[1]
    }

    const mouseAngle = (
      Math.atan2(center.y - mousePosition.y, center.x - mousePosition.x) * 180 / Math.PI
    )

    const distX = center.x - mousePosition.x
    const distY = center.y - mousePosition.y

    this.setState({
      hand: {
        cardId: cardId,
        lastMouseAngle: mouseAngle,
        distance: Math.sqrt((distX * distX) + (distY * distY))
      }
    }, () => {
      this
        .gameRef
        .child("cards")
        .child(cardId)
        .child("position")
        .child("2")
        .set(Object.keys(game.cards || {}).length)
    })
  },


  getSelectPositionAndSize (p2) {
    const { select } = this.state

    if (!select) {
      return {
        position: [0, 0],
        size: [0, 0]
      }
    }

    p2 = p2 || select.p2

    return {
      position: [
        Math.min(select.p1[0], p2[0]),
        Math.min(select.p1[1], p2[1]),
      ],

      size: [
        Math.abs(select.p1[0] - p2[0]),
        Math.abs(select.p1[1] - p2[1])
      ]
    }
  },


  beginSelect (x, y) {
    this.setState({
      select: {
        p1: [x, y],
        p2: [x, y],
        cards: []
      }
    })
  },


  resizeSelect (x, y) {
    const { select } = this.state

    const { position, size } = this.getSelectPositionAndSize([x, y])

    this.setState({
      select: {
        p1: select.p1,
        p2: [x, y],
        cards: this.getOverlappingCardsOf(null, position, size)
      }
    })
  },


  updateSelectCards () {
    const { select } = this.state

    const { position, size } = this.getSelectPositionAndSize(select.p2)

    this.setState({
      select: Object.assign({}, select, {
        cards: this.getOverlappingCardsOf(null, position, size)
      })
    })
  },


  completeSelect (x, y) {
    const { position, size } = this.getSelectPositionAndSize([x, y])

    this.setState({
      select: {
        p1: [0, 0],
        p2: [0, 0],
        cards: this.getOverlappingCardsOf(null, position, size)
      }
    })
  },


  clearSelect () {
    this.setState({ select: null })
  },


  handleMouseDown (e) {
    if (e.shiftKey) {
      e.preventDefault()
      console.log("begin select", e.pageX, e.pageY)
    }
  },


  handleMouseMove (e) {
    const { game, hand } = this.state

    if (e.buttons == 0) {
      this.releaseHandCard()
      return
    } else if (e.shiftKey && !hand) {
      // TODO: Update select rect

    } else if (hand) {
      const card = game.cards[hand.cardId]

      const p1 = { x: e.pageX, y: e.pageY }
      const p2 = {
        x: card.position[0],
        y: card.position[1]
      }

      const mouseAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI

      const distX = p2.x - p1.x
      const distY = p2.y - p1.y

      const distance = Math.sqrt((distX * distX) + (distY * distY))
      const travelDistance = hand.distance - distance

      const nextPosition = [
        card.position[0] + (Math.cos((mouseAngle * Math.PI) / 180) * travelDistance),
        card.position[1] + (Math.sin((mouseAngle * Math.PI) / 180) * travelDistance),
        Object.keys(game.cards || {}).length + 1
      ].map((axis) => {
        return Math.min(Math.max(0, axis), 2048)
      })

      this.setState({
        hand: Object.assign({}, hand, {
          lastMouseAngle: mouseAngle
        })
      }, () => {
        this
          .gameRef
          .child("cards")
          .child(hand.cardId)
          .update({
            angle: (card.angle + (mouseAngle - hand.lastMouseAngle)),
            position: nextPosition
          })
      })

    }
  },


  releaseHandCard () {
    if (this.state.hand == null) {
      return
    }

    const { game } = this.state
    const { cardId } = this.state.hand

    this.setState({
      hand: null
    }, () => {
      this
        .gameRef
        .child("cards")
        .child(cardId)
        .update({
          angle: (game.cards[cardId].angle % 360)
        }).then(() => {
          this.normalizeCardZ(cardId, game.cards[cardId])
        })
    })
  },


  normalizeCardZ (cardId, card) {
    const overlapping = this.getOverlappingCardsOf(cardId, card.position, card.size)

    overlapping.forEach((overlappingCard, idx) => {
      this.gameRef.child("cards").child(overlappingCard._id).child("position").child("2").set(idx)
    })

    this.gameRef.child("cards").child(cardId).child("position").child("2").set(overlapping.length)
  },


  componentDidMount () {
    const { firebase, gameId } = this.props

    this.storageUrls = {}

    this.gameRef = firebase.database().ref("games").child(gameId)
    this.gameRef.on("value", this.gameValueChange)

    this.props.setCurrentGameKey(this.props.gameId)

    document.addEventListener("mousedown", this.handleMouseDown)
    document.addEventListener("mouseup", this.handleMouseUp)
    this.boardRef.addEventListener("mousemove", this.handleMouseMove)
  },


  componentWillUnmount () {
    document.removeEventListener("mousedown", this.handleMouseDown)
    document.removeEventListener("mouseup", this.handleMouseUp)
    this.boardRef.removeEventListener("mousemove", this.handleMouseMove)
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


  getStorageUrl (file, callback) {
    const url = this.storageUrls[file]
    if (url != undefined) {
      if (url === "") {
        setTimeout(() => {
          this.getStorageUrl(file, callback)
        }, 10)
      } else {
        callback(url)
      }
    } else {
      this.storageUrls[file] = ""
      this.props.firebase.storage().ref().child(file).getDownloadURL().then((url) => {
        this.storageUrls[file] = url
        callback(url)
      })
    }
  },


  handleMouseUp () {
    this.releaseHandCard()
  },


  say (message) {
    const { currentUser } = this.props

    this.gameRef.child("messages").push({
      accountId: currentUser.uid,
      type: "say",
      message: message,
      createdAt: Date.now()
    })
  },


  flipCard (cardId) {
    const { game } = this.state

    return this
      .gameRef
      .child("cards")
      .child(cardId)
      .update({ faceUp: !game.cards[cardId].faceUp })
      .then(() => {
        this.releaseHandCard()
      })
  },


  getOverlappingCardsOf (cardId, position, size) {
    const cards = this.cards()

    const overlapping = cards.filter((layeredCard) => {
      if (layeredCard._id == cardId) {
        return false
      }

      const left = position[0] < (layeredCard.position[0] + layeredCard.size[0])
      const right = (position[0] + size[0]) > layeredCard.position[0]
      const top = position[1] < (layeredCard.position[1] + layeredCard.size[1])
      const bottom = (position[1] + size[1]) > layeredCard.position[1]

      return left && right && top && bottom
    })

    return _.sortBy(overlapping, (c) => { return c.position[2] })
  },


  cards () {
    const { game } = this.state

    if (!game) {
      return []
    }

    const cardsArray = Object.keys(game.cards || {}).map((cardId) => {
      return Object.assign({}, game.cards[cardId], {
        _id: cardId
      })
    })

    return _.sortBy(cardsArray, (card) => { return (card.position[2] || 0) })
  },


  render () {
    const { game } = this.state
    const { currentUser } = this.props
    const interactive = !!(currentUser && game && game.players && game.players[currentUser.uid])

    const messages = (game ? game.messages : null) || {}

    return (
      <div className="game">
        <div ref={(ele) => this.boardRef = ele} className="game-board">
          {this.renderCards(interactive)}
        </div>

        <GameChat
          firebase={this.props.firebase}
          messages={messages}
          say={this.say}
          interactive={interactive}
          />
        {this.renderEdit()}
      </div>
    )
  },


  renderCards (interactive) {
    const { hand } = this.state
    const { firebase, gameId, currentUser } = this.props

    const cards = this.cards()

    return cards.map((card) => {
      const isHandCard = hand ? (hand.cardId == card._id) : false
      return (
        <GameCard
          key={card._id}
          firebase={firebase}
          gameId={gameId}
          cardId={card._id}
          card={card}
          currentUser={currentUser}
          interactive={interactive}
          getStorageUrl={this.getStorageUrl}
          setHandCard={this.setHandCard}
          isHandCard={isHandCard}
          flipCard={this.flipCard}
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
  }
})
