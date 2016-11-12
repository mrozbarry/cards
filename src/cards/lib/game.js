export function gameNew (user) {
  return gameAddPlayer({
    name: user.isAnonymous ? "A new game" : `${user.displayName}'s new game`,
    ownerId: user.uid,
    chat: [],
    players: [],
    cards: [],
    stacks: []
  }, user)
}

export function gameIsAbandoned (game) {
  const players = game.players || []
  return players.length === 0 || players.every((player) => {
    return Date.now() > player.pingedAt + 10000
  })
}

export function gameAddPlayer (game, user) {
  return Object.assign({}, game, {
    players: (game.players || []).concat({
      id: user.uid,
      pingedAt: Date.now()
    })
  })
}

export function gamePingPlayer (game, user) {
  return Object.assign({}, game, {
    players: (game.players || []).map((player) => {
      if (player.id == user.uid) {
        return Object.assign({}, player, {
          pingedAt: Date.now()
        })
      } else {
        return player
      }
    })
  })
}

export function gameRemovePlayer (game, user) {
  return Object.assign({}, game, {
    players: (game.players || []).filter((player) => player.id != user.uid),
    stacks: (game.stacks || []).concat({
      id: `stack:${user.uid}`,
      position: [0, 0]
    }),
    cards: (game.cards || []).map((card) => {
      if (card.location == `player:${user.id}`) {
        return Object.assign({}, card, {
          location: "stack:${user.id}",
          visible: false
        })
      } else {
        return card
      }
    })
  })
}

export function gameGetPlayer (game, user) {
  return (game.players || []).find((player) => {
    return player.id == user.uid
  })
}

export function gameAddMessage (game, user, message , type) {
  return Object.assign({}, game, {
    chat: (game.chat || []).concat({
      playerId: user.uid,
      type: type || "message",
      message: message,
      createdAt: Date.now()
    })
  })
}
