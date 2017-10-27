export function arrayOfSize (size) {
  return Array.from(" ".repeat(size)).map(() => null)
}


export function firebaseCollectionToArray (collection) {
  if (!collection) {
    return []
  }

  return Object.keys(collection).map((gameId) => {
    return { ...collection[gameId], _id: gameId }
  })
}

