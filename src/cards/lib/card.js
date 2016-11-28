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

// Refactored from http://stackoverflow.com/a/12266311/661764
function pastelColour(){
  const rgb = [0, 1, 2].map(function () {
    return (Math.round(Math.random()* 127) + 127).toString(16)
  })
  return "#" + rgb.join("")
}

export function build (position, angle) {
  return {
    colour: pastelColour(),
    position: position,
    size: [100, 130],
    angle: angle
  }
}
