
export function build (currentUser) {
  return {
    name: "A new game",
    description: "Come join me and play some cards",
    ownerId: currentUser.uid,
    messages: {},
    players: {},
    cards: {},
    maxPlayers: 4,
    visible: false
  }
}

export function all (firebase) {
  return firebase.database().ref("games")
}

export function find (firebase, gameId) {
  return all(firebase).child(gameId)
}

export function update (firebase, gameId, attrs) {
  return find(firebase, gameId).update(attrs)
}

export function addCard (firebase, gameId, card) {
  const ref = find(firebase, gameId).child("cards").push()

  return ref.set(card)
}

export function removeCard (firebase, gameId, cardId) {
  return find(firebase, gameId).child("cards").child(cardId).remove()
}

export function isParticipating (game, currentUser) {
  if (!currentUser || !game || !game.players) {
    return false
  } else {
    return !!game.players[currentUser.uid]
  }
}

export function canSee (game, currentUser) {
  if (game.visible) {
    return true
  } else if (currentUser) {
    return currentUser.uid === game.ownerId
  }

  return false
}

export function canJoin (game, currentUser) {
  if (!game || !currentUser || !currentUser.uid) {
    return false
  }

  return Object.keys(game.players || {}).length < game.maxPlayers
}

export function joinGame (firebase, game, currentUser) {
  if (canJoin(game, currentUser)) {
    return find(firebase, game._id)
      .child("players")
      .child(currentUser.uid)
      .set(true) // TODO: What goes here?
  } else {
    return false
  }
}


export function leaveGame (firebase, game, currentUser) {
  if (isParticipating(game, currentUser)) {
    return find(firebase, game._id)
      .child("players")
      .child(currentUser.uid)
      .remove()
  } else {
    return false
  }
}


export const GameListenerMixin = function ({ saveToStateKey, gameKeyFromPropKey }) {
  saveToStateKey = saveToStateKey || "game"
  gameKeyFromPropKey = gameKeyFromPropKey || "gameId"
  return {
    getInitialState () {
      return {
        [saveToStateKey]: null
      }
    },

    hasDifferentGameKey (nextProps) {
      return !!nextProps[gameKeyFromPropKey] &&
        this.props[gameKeyFromPropKey] != nextProps[gameKeyFromPropKey]
    },

    hasLostGameKey (nextProps) {
      return !nextProps[gameKeyFromPropKey] &&
        this.props[gameKeyFromPropKey] != nextProps[gameKeyFromPropKey]
    },

    addGameListener (gameId) {
      const { firebase } = this.props

      this.removeGameListener()

      if (gameId) {
        this.gameRef = find(firebase, gameId)
        this.gameRef.on("value", this.handleGameValueChange)
      }
    },

    removeGameListener () {
      if (this.gameRef) {
        this.gameRef.off("value", this.handleGameValueChange)
        this.gameRef = null
      }
    },

    componentWillMount () {
      this.addGameListener(this.props[gameKeyFromPropKey])
    },

    componentWillUnmount () {
      this.removeGameListener()
    },

    componentWillReceiveProps (nextProps) {

      if (this.hasDifferentGameKey(nextProps)) {
        this.addGameListener(nextProps[gameKeyFromPropKey])
      } else if (!nextProps[gameKeyFromPropKey] && this.gameRef) {
        this.removeGameListener()
        this.setState({ [saveToStateKey]: null })
      }
    },

    handleGameValueChange (snapshot) {
      const game
        = Object
        .assign({}, snapshot.val(), {
          _id: snapshot.key
        })

      this.setState({
        [saveToStateKey]: game
      })
    }
  }
}
