// import uuid from "uuid"
//
// export const deckIdxToName = [
//   "Emerald",
//   "Peter River",
//   "Pomegranate",
//   "Sun Flower"
// ]
//
// export function standard52 (deckIdx) {
//   return ["Clubs", "Diamonds", "Hearts", "Spades"].reduce((cards, suit) => {
//     const cardsInSuit = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"].reduce((suitCards, face) => {
//       const key = uuid.v4()
//       return Object.assign({}, suitCards, {
//         [key]: {
//           _id: key,
//           deckIdx: deckIdx,
//           suit: suit,
//           face: face
//         }
//       })
//     }, cards)
//
//     return Object.assign({}, cards, cardsInSuit)
//   }, {})
// }

export function build ({ face, back, size, position, angle, faceUp }) {
  return {
    face: face,
    back: back,
    position: [0, 1, 2].map((axis) => position[axis] || 0),
    size: size,
    angle: angle || 0,
    faceUp: !!faceUp
  }
}
