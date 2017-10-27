import "./GameChat.css"

import React from "react"

import GameChatMessage from "components/GameChatMessage"

import _ from "lodash"

const { object, bool, func } = React.PropTypes

export default React.createClass({
  displayName: "GameChat",

  propTypes: {
    firebase: object.isRequired,
    interactive: bool.isRequired,
    say: func.isRequired,
    messages: object
  },


  getInitialState () {
    return {
      lastMessageKey: null,
      unreadCount: 0,
      isOpen: false,
      message: ""
    }
  },


  componentWillReceiveProps (nextProps) {
    const { lastMessageKey, isOpen } = this.state
    const { messages } = nextProps || {}

    const keys = Object.keys(messages || {})

    if (_.last(keys) != lastMessageKey && !isOpen) {
      const unread = keys.length - (keys.indexOf(lastMessageKey) + 1)
      this.setState({ unreadCount: unread })
    }
  },


  componentDidUpdate (prevProps) {
    const prevMessageCount = Object.keys(prevProps.messages || {}).length
    const currentMessageCount = Object.keys(this.props.messages || {}).length

    if (this.state.isOpen && prevMessageCount < currentMessageCount) {
      this.scrollMessagesToBottom()
    }
  },


  toggleChat (open) {
    this.setState({
      isOpen: open,
      lastMessageKey: _.last(Object.keys(this.props.messages || {})),
      unreadCount: 0
    }, () => {
      if (open) {
        this.scrollMessagesToBottom()
      }
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


  messageKeyUp (e) {
    if (e.which === 13) {
      const { message } = this.state
      this.setState({
        message: ""
      }, () => {
        this.props.say(message)
      })
    }
  },


  scrollMessagesToBottom () {
    this.messagesDiv.scrollTop = this.messagesDiv.scrollHeight
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
        <div ref={(ele) => this.messagesDiv = ele} className="game-chat__messages">
          {this.renderMessageList()}
        </div>
        {this.renderInput()}
        <a href="#" onClick={this.closeChat} className="game-chat__close btn waves-effect waves-light red darken-4">
          <i className="material-icons">keyboard_arrow_down</i>
        </a>
      </div>
    )
  },


  renderInput () {
    if (this.props.interactive) {
      return (
        <div className="game-chat__you">
          <input
            type="text"
            placeholder="Say something"
            onChange={this.messageChange}
            onKeyUp={this.messageKeyUp}
            value={this.state.message}
          />
        </div>
      )
    } else {
      return null
    }
  },


  renderMessageList () {
    const { firebase, messages } = this.props

    const messageKeys = Object.keys(messages)

    if (messageKeys.length > 0) {
      return messageKeys.map((messageKey) => {
        const message = messages[messageKey]
        return (
          <GameChatMessage
            key={messageKey}
            message={message}
            firebase={firebase}
          />
        )
      })
    } else {
      return (
        <div style={{ textAlign: "center", padding: "10px" }}>
          Nobody has said anything yet.
        </div>
      )
    }
  }
})
