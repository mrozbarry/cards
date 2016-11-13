import "./Game.css"

import React from "react"

import GameChat from "components/GameChat"

import PlayersMixin from "PlayersMixin"

import { navigate } from "react-mini-router"

import _ from "lodash"

const { object, string, bool } = React.PropTypes

const imageContext = require.context("assets/", true, /\.png$/)

const deckIdxToName = [
  "Emerald",
  "Peter River",
  "Pomegranate",
  "Sun Flower"
]

export default React.createClass({
  displayName: "Game",

  propTypes: {
    firebase: object.isRequired,
    gameId: string.isRequired,
    player: object,
    editMode: bool
  },

  mixins: [
    PlayersMixin
  ],

  getInitialState () {
    return {
      game: null,
      gameTextShow: false,
      modalForStackKey: null
    }
  },

  componentWillMount () {
    const { firebase, gameId, player } = this.props

    this.gameRef = firebase.database().ref("games").child(gameId)
    this.gameRef.on("value", this.gameValueChange)

    this.playerRef = this.gameRef.child("players").child(player.userId)

    this.playerRef.set({
      userId: player.userId,
      position: [0, 0],
      visible: false
    })

    this.submitMousePosition = _.throttle((position) => {
      this.playerRef.update({
        position: ["x", "y"].map((axis) => parseInt(position[axis])),
        visible: true
      })
    }, 50)
  },

  componentWillUnmount () {
    const { player } = this.props

    this.gameRef.off("value", this.gameValueChange)
    this.gameRef.child("players").child(player.userId).remove()
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
    this.submitMousePosition(this.clientToSvgCoord(e))
  },

  say (message) {
    this.gameRef.child("messages").push({
      userId: this.props.player.userId,
      type: "say",
      message: message,
      createdAt: Date.now()
    })
  },

  takeTopCard (stackKey, e) {
    if (e) {
      e.preventDefault()
    }
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

  showStackOptionsFor (stackKey, e) {
    e.preventDefault()

    this.setState({
      modalForStackKey: stackKey
    })
  },

  stackTakeFromTop (e) {
    e.preventDefault()

    const { modalForStackKey } = this.state
    const { player } = this.props
    const { game } = this.state
    const stack = game.stacks[modalForStackKey]
    const nextStackCards = stack.cards.slice(0, -1)
    const myCard = _.last(game.stacks[modalForStackKey].cards)

    if (nextStackCards.length > 0) {
      this.gameRef.child("stacks").child(modalForStackKey).child("cards").set(nextStackCards)
    } else {
      this.gameRef.child("stacks").child(modalForStackKey).remove()
    }

    const myStackKey = _.findKey(game.stacks, (gStack) => {
      return gStack.ownedBy == player.userId
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
        ownedBy: player.userId,
        faceUp: false
      })
    }

    this.setState({ modalForStackKey: null })
  },

  stackFlip (e) {
    e.preventDefault()

    const { modalForStackKey } = this.state

    this.gameRef
      .child("stacks")
      .child(modalForStackKey)
      .child("faceUp")
      .set(!this.state.game.stacks[modalForStackKey].faceUp)

    this.setState({ modalForStackKey: null })
  },

  stackShuffle (e) {
    e.preventDefault()

    const { modalForStackKey } = this.state

    this.gameRef
      .child("stacks")
      .child(modalForStackKey)
      .child("cards")
      .set(_.shuffle(this.state.game.stacks[modalForStackKey].cards))

    this.setState({ modalForStackKey: null })
  },

  render () {
    return (
      <div className="game">
        <svg ref={(ele) => this.svg = ele} className="game-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet" onMouseMove={this.mouseMove}>
          <rect x="0" y="0" width="1920" height="1080" fill="#076324" onDragOver={this.dragOverTable} onDrop={this.dropOntoTable} />
          {this.renderStacks()}
          {this.renderCursors()}
        </svg>

        {this.renderGameTitle()}

        <GameChat firebase={this.props.firebase} game={this.state.game} players={this.state.players} say={this.say} toggleGameText={this.toggleGameText} />
        <div style={{ position: "absolute", left: "20px", bottom: "20px" }}>
          {this.renderPlayers()}
        </div>
        {this.renderStackModal()}
        {this.renderEdit()}
        {this.renderEditButton()}
      </div>
    )
  },

  renderEditButton () {
    if (!this.state.game) {
      return
    }

    if (this.state.game.ownerId == this.props.player.userId) {
      const url = `/games/${this.props.gameId}/edit`
      return (
        <a href={url} className="white-text" style={{ position: "absolute", top: "20px", left: "20px" }}>
          <i className="material-icons">edit</i>
        </a>
      )
    } else {
      return null
    }
  },

  renderEdit () {
    const { game } = this.state

    if (!game || !this.props.editMode) {
      return
    }

    return (
      <div style={{ position: "absolute", left: "50%", width: "400px", marginLeft: "-200px", bottom: 0, backgroundColor: "white", padding: "10px" }}>
        <h3>Game Configuration</h3>

        <input type="text" placeholder="Name of your game" value={game.name || ""} onChange={this.gameNameChange} />
        <textarea placeholder="Explain what game you are playing" value={game.description || ""} onChange={this.gameDescriptionChange} />

        <hr />
        <input type="checkbox" id="visible" checked={game.visible} onChange={this.gameVisibleChange} />
        <label htmlFor="visible">Is this game visible?</label>

        <br />

        <a className="btn waves-effect waves-light" href={`/games/${this.props.gameId}`}>Done</a>

      </div>
    )
  },

  gameNameChange (e) {
    this.gameRef.child("name").set(e.target.value)
  },

  gameDescriptionChange (e) {
    this.gameRef.child("description").set(e.target.value)
  },

  gameVisibleChange (e) {
    this.gameRef.child("visible").set(e.target.checked)
  },

  renderStackModal () {
    const { game, modalForStackKey } = this.state

    if (!game) {
      return null
    }

    if (modalForStackKey) {
      const stack = game.stacks[modalForStackKey]
      return (
        <div style={{ position: "absolute", left: "50%", width: "400px", marginLeft: "-200px", bottom: 0, backgroundColor: "white", padding: "10px" }}>
          <h4>Stack of {stack.cards.length} cards</h4>
          <div className="collection">
            <a href="#" className="collection-item" onClick={this.stackTakeFromTop}>Pick up a card</a>
            <a href="#" className="collection-item" onClick={this.stackFlip}>Flip this stack</a>
            <a href="#" className="collection-item" onClick={this.stackShuffle}>Shuffle</a>
          </div>
        </div>
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
    const players = this.state.players || {}
    const game = this.state.game || {}

    return Object.keys(game.players || {}).map((playerKey) => {
      const player = players.find((p) => p._id == playerKey)
      if (player) {
        return (
          <div key={playerKey} data-player={playerKey}>
            <div
              style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundSize: "cover", backgroundImage: `url(${player.image})` }}
              />
            <div>
              {this.renderPlayerCards(game.players[playerKey])}
            </div>
          </div>
        )
      } else {
        return null
      }
    })
  },

  renderPlayerCards (gamePlayer) {
    if (!this.state.game) {
      return null
    }

    const { game } = this.state

    if (!game.players) {
      return null
    }

    const playerStackKey = _.findKey(game.stacks || {}, (gStack) => {
      return gStack.ownedBy == gamePlayer.userId
    })

    if (!playerStackKey) {
      return
    }

    if (gamePlayer.userId == this.props.player.userId) {
      return game.stacks[playerStackKey].cards.map((playerCard) => {
        const card = game.cards[playerCard]

        return (
          <img
            key={playerCard}
            src={imageContext(`./cards/${card.suit}/${card.face}.png`)}
            height="64"
            width="auto"
            onDragStart={this.dragStartFromHand.bind(this, playerStackKey, playerCard)}
            onDragEnd={this.dragEndFromHand.bind(this, playerStackKey, playerCard)}
            />
        )
      })
    } else {
      return game.stacks[playerStackKey].cards.map((playerCard) => {
        const card = game.cards[playerCard]

        return (
          <img key={playerCard} src={imageContext(`./cards/Back/${deckIdxToName[card.deckIdx]}.png`)} height="64" width="auto" />
        )
      })
    }
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
        const lastCard = game.cards[_.last(stack.cards)]
        const imageHref = stack.faceUp ? imageContext(`./cards/${lastCard.suit}/${lastCard.face}.png`) : imageContext(`./cards/Back/${deckIdxToName[lastCard.deckIdx]}.png`)
        const [x, y] = stack.position

        return (
          <image
            key={stackKey}
            href={imageHref}
            width={255*0.7}
            height={380*0.7}
            x={x}
            y={y}
            onClick={this.showStackOptionsFor.bind(this, stackKey)}
            onDragOver={this.dragOverStack.bind(this, stackKey)}
            onDrop={this.dropOntoStack.bind(this, stackKey)}
            />
        )

      } else {
        return null
      }
    })
  },

  renderCursors () {
    const { player } = this.props

    const players = this.state.players || {}
    const game = this.state.game || {}

    return Object.keys(game.players || {}).map((playerKey) => {
      if (!players[playerKey] || player.userId == playerKey) {
        return null
      }

      const cursorPlayer = game.players[playerKey]
      if (cursorPlayer.position) {
        const [x, y] = cursorPlayer.position

        const name = playerKey == player.userId ? "You" : players[playerKey].name

        return (
          <g key={playerKey} style={{ zIndex: playerKey == player.userId ? 999 : undefined }}>
            <text x={x} y={y - 10} textAnchor="start" style={{ transition: "all 0.1s ease" }}>{name}</text>
            <image href={imageContext("./cursor.png")} x={x - 28} y={y} width={64} height={101} style={{ transition: "all 0.05s ease" }} />
          </g>
        )
      } else {
        return null
      }
    })
  }
})
