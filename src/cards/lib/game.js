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
  if (!game) {
    return false
  } else if (!game.players) {
    return false
  } else {
    return !!game.players[currentUser.uid]
  }
}

export function canJoin (game, currentUser) {
  if (!game || !currentUser) {
    return false
  }

  return Object.keys(game.players || {}).length < game.maxPlayers
}
