import * as Account from "lib/account"

export default class FirebaseAuthHelper {
  constructor (firebase) {
    this._auth = firebase.auth()
    this.cancellables = []
  }


  onStateChange (callback) {
    const cancel = this._auth.onAuthStateChanged((user) => {
      callback(null, user)
    }, (error) => {
      callback(error)
    })
    this.cancellables.push(cancel)
    return cancel
  }


  onTokenChanged (callback) {
    const cancel = this._auth.onIdTokenChanged((user) => {
      callback(null, user)
    }, (error) => {
      callback(error)
    })
    this.cancellables.push(cancel)
    return cancel
  }


  cleanup () {
    this.cancellables.forEach((cancel) => cancel())
    this.cancellables = []
  }
}
//
// export default {
//   getInitialState () {
//     return {
//       currentUser: null,
//       authStateHasChanged: false
//     }
//   },
//
//   componentWillMount () {
//     const { firebase } = this.props
//
//     firebase.auth().onAuthStateChanged(this.handleAuthStateChanged)
//   },
//
//   handleAuthStateChanged (currentUser) {
//     if (currentUser) {
//       this.setState({
//         currentUser: currentUser,
//         authStateHasChanged: true
//       }, () => {
//         this.subscribeToAccount()
//         if (this.afterAuth) {
//           this.afterAuth()
//         }
//       })
//
//     } else {
//       this.unsubscribeAll()
//
//       this.setState({
//         currentUser: null,
//         authStateHasChanged: true
//       })
//     }
//   },
//
//   subscribeToAccount () {
//     const { firebase } = this.props
//     const { currentUser } = this.state
//
//     this.accountRef = Account.find(firebase, currentUser.uid)
//
//     this.accountRef.on("value", this.handleAccountValueChange)
//
//     this.accountDisconnect = this.accountRef.child("status").onDisconnect()
//     this.accountDisconnect.set("offline")
//   },
//
//   unsubscribeAll () {
//     if (this.accountRef) {
//       this.accountRef.off("value", this.handleAccountValueChange)
//       this.accountDisconnect.cancel()
//     }
//   },
//
//   handleAccountValueChange (snapshot) {
//     const { firebase } = this.props
//     const { currentUser } = this.state
//     const account = snapshot.val()
//
//     if (!account) {
//       Account.create(
//         firebase,
//         currentUser,
//         Account.build(currentUser)
//       )
//     }
//   }
// }
