require("./SignIn.css")

import React from "react"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "SignIn",

  propTypes: {
    firebase: object.isRequired
  },

  getInitialState () {
    return {
      error: null
    }
  },

  signInAnonymously () {
    this.props.firebase.auth().signInAnonymously().catch((error) => {
      this.setState({ error: error })
    })
  },

  signInWithGithub () {
    const provider = new this.props.firebase.auth.GithubAuthProvider()
    this.props.firebase.auth().signInWithPopup(provider).catch((error) => {
      this.setState({ error: error })
    })
  },

  render () {
    return (
      <div className="sign-in">
        <div className="sign-in__container">
          {this.renderErrorMessage()}
          <div>Sign in...</div>
          <a className="btn waves-effect waves-light yellow darken-1" onClick={this.signInAnonymously}>Anonymously</a>
          <a className="btn waves-effect waves-light grey darken-4" onClick={this.signInWithGithub}>with Github</a>
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

