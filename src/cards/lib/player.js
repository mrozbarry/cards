export function playerNew (user) {
  return {
    userId: user.uid,
    name: user.displayName || "Anonymous",
    image: user.photoURL || "http://placehold.it/64x64",
    online: true,
    createdAt: Date.now()
  }
}
