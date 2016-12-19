export default {
  getInitialState () {
    return {
      games: []
    }
  },

  componentDidMount () {
    const { firebase } = this.props

    this.gamesRef = firebase.database().ref("games")
    this.gamesRef.on("value", this.gamesValueChanged)
  },

  componentWillUnmount () {
    this.gamesRef.off("value", this.gamesValueChanged)
  },

  gamesValueChanged (snapshot) {
    this.setState({
      games: this.gamesToArray(snapshot.val())
    })
  },

  gamesToArray (games) {
    if (!games) {
      return []
    }

    return Object.keys(games).map((gameId) => {
      return Object.assign({}, games[gameId], {
        _id: gameId
      })
    })
  },
}
