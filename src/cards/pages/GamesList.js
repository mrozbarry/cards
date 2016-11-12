import React from "react"

import { gameIsAbandoned } from "lib/game"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "GamesList",

  propTypes: {
    firebase: object.isRequired
  },

  getInitialState () {
    return {
      games: [],
      refresh: Date.now()
    }
  },

  componentWillMount () {
    const { firebase } = this.props

    this.gamesRef = firebase.database().ref("games")
    this.gamesRef.on("value", this.gamesValueChanged)

    this.refresher = setInterval(() => {
      this.setState({ refresh: Date.now() })
    }, 10000)
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

  render () {
    return (
      <div className="container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th># Players</th>
            </tr>
          </thead>
          <tbody>
            {this.renderGames()}
          </tbody>
        </table>
      </div>
    )
  },

  renderGames () {
    const { games } = this.state

    const occuringGames = games.filter((game) => {
      return !gameIsAbandoned(game)
    })

    return occuringGames.map((game) => {
      const playerCount = game.players ? game.players.length : 0

      return (
        <tr key={game._id}>
          <td><a href={`/games/${game._id}`}>{game.name}</a></td>
          <td>{playerCount}</td>
        </tr>
      )
    })
  }
})
