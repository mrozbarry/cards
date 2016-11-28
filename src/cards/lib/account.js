export function build (currentUser) {
  return {
    name: currentUser.displayName || "Anonymous",
    image: currentUser.photoURL || "http://placehold.it/64x64",
    lastPingAt: Date.now(),
    createdAt: Date.now()
  }
}

export function all (firebase) {
  return firebase.database().ref("accounts")
}

export function find (firebase, key) {
  return all(firebase).child(key)
}

export function create (firebase, currentUser, account) {
  return find(firebase, currentUser.uid).set(account)
}

export function update (firebase, currentUser, accountAttrs) {
  return find(firebase, currentUser.uid).update(accountAttrs)
}

export function ping (firebase, currentUser) {
  return find(firebase, currentUser.uid).update({ lastPingAt: Date.now() })
}

export function destroy (firebase, currentUser) {
  return find(firebase, currentUser.uid).remove().then(() => {
    // TODO:
    //  * Leave all games participated in
    //  * Remove games owned by currentUser
  })
}
