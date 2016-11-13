import "./GameChat.css"

import React from "react"

import _ from "lodash"

const { object, func } = React.PropTypes

export default React.createClass({
  displayName: "GameChat",

  propTypes: {
    firebase: object.isRequired,
    say: func.isRequired,
    toggleGameText: func.isRequired,
    game: object,
    players: object
  },

  getInitialState () {
    return {
      lastMessageKey: null,
      unreadCount: 0,
      isOpen: false,
      message: ""
    }
  },

  shouldComponentUpdate (nextProps, nextState) {
    return !_.matches(nextState)(this.state) ||
      Object.keys(nextProps.game.messages || {}).length != Object.keys(this.props.game.messages || {}).length
  },

  componentWillReceiveProps (nextProps) {
    const { lastMessageKey, isOpen } = this.state
    const { messages } = nextProps.game

    const keys = Object.keys(messages || {})

    if (_.last(keys) != lastMessageKey && !isOpen) {
      const unread = keys.length - keys.indexOf(lastMessageKey)
      this.setState({ unreadCount: unread })
    }
  },

  toggleChat (open) {
    this.setState({
      isOpen: open
    }, () => {
      this.props.toggleGameText(open)
    })
  },

  openChat (e) {
    e.preventDefault()

    this.toggleChat(true)
  },

  closeChat (e) {
    e.preventDefault()

    this.toggleChat(false)
  },

  getUnreadCount () {
    const { unreadCount } = this.state
    if (unreadCount >= 10) {
      return "10+"
    } else {
      return unreadCount
    }
  },

  messageChange (e) {
    this.setState({
      message: e.target.value
    })
  },

  render () {
    if (this.state.isOpen) {
      return this.renderMessages()
    } else {
      return this.renderIcon()
    }
  },

  renderIcon () {
    return (
      <a href="#" className="game-chat game-chat--icon btn-floating btn-large waves-effect waves-light red darken-4" onClick={this.openChat}>
        <i className="material-icons" data-count={this.getUnreadCount()}>message</i>
      </a>
    )
  },

  renderMessages () {
    return (
      <div className="game-chat game-chat--full">
        <div className="game-chat__messages">
        </div>
        <div className="game-chat__you" style={{ backgroundColor: "white", padding: "10px", paddingBottom: 0 }}>
          <input type="text" placeholder="Say something" onChange={this.messageChange} value={this.state.message} />
        </div>
        <a href="#" onClick={this.closeChat} className="game-chat__close btn-floating waves-effect waves-light red darken-4">
          <i className="material-icons">arrow_drop_down</i>
        </a>
      </div>
    )
  }
})
