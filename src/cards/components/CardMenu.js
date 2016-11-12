require("./CardMenu.css")
import React from "react"

const { object, func } = React.PropTypes

export default React.createClass({
  displayName: "CardMenu",

  propTypes: {
    toggleSignIn: func.isRequired,
    auth: object.isRequired,
    user: object
  },

  openSignIn (e) {
    e.preventDefault()
    this.props.toggleSignIn(true)
  },

  signOut (e) {
    e.preventDefault()
    this.props.auth.signOut()
  },

  render () {
    return (
      <div>
        <ol className="card-menu">
          <li className="card-menu__item">
            <a href="/">Home</a>
          </li>
          <li className="card-menu__item">
            <a href="/games">Games</a>
          </li>
          <li className="card-menu__spacer" />
          <li className="card-menu__item">
            {this.renderProfileLink()}
          </li>
          {this.renderSignOutItem()}
        </ol>
      </div>
    )
  },

  renderProfileLink () {
    const { user } = this.props

    if (user) {
      return <a href="/profile">Profile</a>
    } else {
      return <a href="/login" onClick={this.openSignIn}>Log in</a>
    }
  },

  renderSignOutItem () {
    const { user } = this.props

    if (user) {
      return (
        <li className="card-menu__item">
          <a href="/logout" onClick={this.signOut}>Log out</a>
        </li>
      )
    }
  }
})
