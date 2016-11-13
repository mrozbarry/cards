import React from "react"

import vagueTime from "vague-time"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "GameChatMessage",

  propTypes: {
    message: object.isRequired,
    player: object.isRequired
  },

  getInitialState () {
    return {
      vague: this.getVagueTime()
    }
  },

  componentDidMount () {
    if (this.props.message.type == "say") {

      this.vagueInterval = setInterval(() => {
        this.setState({ vague: this.getVagueTime() })
      }, 5000)

    }
  },

  componentWillUnmount () {
    if (this.vagueInterval) {
      clearInterval(this.vagueInterval)
    }
  },

  getVagueTime () {
    return vagueTime.get({
      to: this.props.message.createdAt,
      from: Date.now()
    })
  },

  render () {
    const { message } = this.props

    if (message.type == "say") {
      return this.renderSay(message)
    } else {
      return this.renderNotify(message)
    }
  },

  renderSay (message) {
    const { player } = this.props

    return (
      <div className="game-chat__messages-item">
        <div className="game-chat__messages-item-who">
          <img src={player.image} width="32" height="32" style={{ borderRadius: "50%" }} />
          {player.name}
          <div style={{ flexGrow: 1 }} />
          <small>{this.state.vague}</small>
        </div>
        <div className="game-chat__messages-item-text">
          {message.message}
        </div>
      </div>
    )
  },

  renderNotify (message) {
    return (
      <div className="game-chat__messages-item">
        <div className="game-chat__messages-item-text" style={{ color: "#8e8e8e" }}>
          {message.message}
        </div>
      </div>
    )
  }
})
