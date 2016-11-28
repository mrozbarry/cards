import React from "react"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "GamesCard",

  propTypes: {
    firebase: object.isRequired,
    game: object.isRequired,
    currentUser: object
  },

  deleteGame (e) {
    const { firebase, game } = this.props

    e.preventDefault()

    firebase.database().ref("games").child(game._id).remove()
  },

  render () {
    const { game } = this.props

    const numberOfPlayers = game.players ? Object.keys(game.players || {}).length : 0

    return (
      <div className="card teal darken-2">
        <div className="card-content white-text" style={{ height: "300px"}}>
          <h3>{game.name}</h3>
          <div>
            {numberOfPlayers} / {game.maxPlayers}
          </div>
          <div>
            {game.description}
          </div>
        </div>
        {this.renderGameActions(game)}
      </div>
    )
  },

  renderGameActions (game) {
    const numberOfPlayers = game.players ? Object.keys(game.players || {}).length : 0
    if (numberOfPlayers < game.maxPlayers) {
      const { currentUser } = this.props
      const gameUrl = `/games/${game._id}`

      let anchors = [
        <a key="join" href={gameUrl}>Open Game</a>
      ]

      if (currentUser && game.ownerId === currentUser.uid) {
        anchors.push(
          <a key="delete" href="#" onClick={this.deleteGame}>Delete Game</a>
        )
      }

      return (
        <div className="card-action">
          {anchors}
        </div>
      )
    } else {
      return null
    }
  }
})

