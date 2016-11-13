import * as Player from "lib/player"

export default {
  getInitialState () {
    return {
      currentUser: null,
      player: null,
      authStateHasChanged: false
    }
  },

  componentWillMount () {
    const { firebase } = this.props

    firebase.auth().onAuthStateChanged(this.handleAuthStateChanged)
  },

  handleAuthStateChanged (currentUser) {
    console.log("handleAuthStateChanged", currentUser)
    if (currentUser) {
      this.setState({
        currentUser: currentUser,
        authStateHasChanged: true
      }, () => {
        this.subscribeToUserPlayer()
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

  subscribeToUserPlayer () {
    const { firebase } = this.props
    const { currentUser } = this.state

    this.playerRef = firebase
      .database()
      .ref("players")
      .child(currentUser.uid)

    this.playerRef.on("value", this.handlePlayerValueChange)
    this.playerDisconnect = this.playerRef.child("online").onDisconnect()
    this.playerDisconnect.set(false)
    this.playerRef.child("online").set(true)
  },

  unsubscribeAll () {
    if (this.playerRef) {
      this.playerRef.off("value", this.handlePlayerValueChange)
      this.playerDisconnect.cancel()
    }
    this.setState({
      player: null
    })
  },

  handlePlayerValueChange (snapshot) {
    const { currentUser } = this.state
    const player = snapshot.val()

    if (player) {
      this.setState({
        player: player
      })
    } else {
      snapshot.ref.set(Player.playerNew(currentUser))
    }
  }
}
