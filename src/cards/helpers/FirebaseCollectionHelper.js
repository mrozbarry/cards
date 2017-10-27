export default class FirebaseCollectionHelper {
  constructor (ref) {
    this.ref = ref
    this.callbacks = []
  }


  onValue (callback) {
    this.ref.on("value", callback)
    this.callbacks.push({ callback })
  }


  offValue (cb) {
    this.ref.off("value", cb)
    this.callbacks = this.callbacks.filter(({ callback }) => callback !== cb)
  }


  cleanup () {
    this.callbacks.forEach(({ callback }) => this.ref.off("value", callback))
    this.callbacks = []
  }
}
