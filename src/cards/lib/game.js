import uuid from "uuid"

export function gameNew (player, numberOfDecks) {
  numberOfDecks = Math.min(Math.max(numberOfDecks || 1, 1), 4)

  const defaultGame = {
    name: player.isAnonymous ? "A new game" : `${player.name}'s new game`,
    description: "Come join me and play some cards",
    ownerId: player.userId,
    chat: {},
    players: {},
    stacks: {},
    cards: {},
    numberOfDecks: numberOfDecks,
    maxPlayers: 4,
    visible: true
  }

  return arrayOfSize(numberOfDecks).reduce((gameWithDecks, _, deckIdx) => {
    const stackKey = uuid.v4()
    return Object.assign({}, gameWithDecks, {
      stacks: Object.assign({}, gameWithDecks.stacks, {
        [stackKey]: {
          position: [
            deckIdx * 260,
            350
          ],
          owner: "table"
        }
      }),
      cards: Object.assign({}, gameWithDecks.cards, standard52(deckIdx, `stack:${stackKey}`))
    })
  }, defaultGame)
}

function arrayOfSize (size) {
  return Array.from(" ".repeat(size)).map(() => null)
}

function standard52 (deckIdx, owner) {
  return ["Clubs", "Diamonds", "Hearts", "Spades"].reduce((cards, suit) => {
    const cardsInSuit = Array.from("A1234567891JQK").reduce((suitCards, face) => {
      const key = `${deckIdx}-${suit}-${face}`
      return Object.assign({}, suitCards, {
        [key]: {
          deckIdx: deckIdx,
          suit: suit,
          face: face,
          owner: owner
        }
      })
    }, cards)

    return Object.assign({}, cards, cardsInSuit)
  }, {})
}

export function gameIsAbandoned (game) {
  const players = game.players || {}

  return Object.keys(players).length === 0
}

