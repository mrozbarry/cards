import * as Account from "lib/account"

export default {
  getInitialState () {
    return {
      currentUser: null,
      authStateHasChanged: false
    }
  },

  componentWillMount () {
    const { firebase } = this.props

    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged)
  },

  handleAuthStateChanged (currentUser) {
    if (currentUser) {
      this.setState({
        currentUser: currentUser,
        authStateHasChanged: true
      }, () => {
        this.subscribeToAccount()
        if (this.afterAuth) {
          this.afterAuth()
        }
      })

    } else {
      this.unsubscribeAll()

      this.setState({
        currentUser: null,
        authStateHasChanged: true
      })
    }
  },

  subscribeToAccount () {
    const { firebase } = this.props
    const { currentUser } = this.state

    this.accountRef = Account.find(firebase, currentUser.uid)

    this.accountRef.on("value", this.handleAccountValueChange)

    this.accountDisconnect = this.accountRef.child("status").onDisconnect()
    this.accountDisconnect.set("offline")
  },

  unsubscribeAll () {
    if (this.accountRef) {
      this.accountRef.off("value", this.handleAccountValueChange)
      this.accountDisconnect.cancel()
    }
  },

  handleAccountValueChange (snapshot) {
    const { firebase } = this.props
    const { currentUser } = this.state
    const account = snapshot.val()

    if (!account) {
      Account.create(
        firebase,
        currentUser,
        Account.build(currentUser)
      )
    }
  }
}
