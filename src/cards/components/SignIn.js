require("./SignIn.css")

import React from "react"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "SignIn",

  propTypes: {
    auth: object.isRequired
  },

  getInitialState () {
    return {
      error: null
    }
  },

  signInAnonymously () {
    this.props.auth.signInAnonymously().catch((error) => {
      this.setState({ error: error })
    })
  },

  render () {
    return (
      <div className="sign-in">
        <div className="sign-in__container">
          {this.renderErrorMessage()}
          <div>Sign in...</div>
          <a className="button" onClick={this.signInAnonymously}>Anonymously</a>
          <a className="button" onClick={this.signInAnonymously}>with Github</a>
        </div>
      </div>
    )
  },

  renderErrorMessage () {
    const { error } = this.state
    if (!error) {
      return null
    }

    return (
      <div>{error.message}</div>
    )
  }
})

