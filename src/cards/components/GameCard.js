import React from "react"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "GamesCard",

  propTypes: {
    firebase: object.isRequired,
    game: object.isRequired,
    player: object.isRequired
  },

  render () {
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
      const { player } = this.props
      const gameUrl = `/games/${game._id}`

      let anchors = [
        <a key="join" href={gameUrl}>Join Game</a>
      ]

      if (player && game.ownerId === player.userId) {
        anchors.push(
          <a key="delete" href="#" onClick={this.deleteGame.bind(this, game)}>Delete Game</a>
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

