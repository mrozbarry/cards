export default {
  getInitialState () {
    return {
      players: []
    }
  },

  componentWillMount () {
    const { firebase } = this.props

    this.playersRef = firebase.database().ref("players")
    this.playersRef.on("value", this.playersValueChanged)
  },

  componentWillUnmount () {
    this.playersRef.off("value", this.playersValueChanged)
  },

  playersValueChanged (snapshot) {
    this.setState({
      players: this.playersToArray(snapshot.val())
    })
  },

  playersToArray (players) {
    if (!players) {
      return []
    }

    return Object.keys(players).map((playerId) => {
      return Object.assign({}, players[playerId], {
        _id: playerId
      })
    })
  },
}
