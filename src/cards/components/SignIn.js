require("./SignIn.css")

import React from "react"

const { object, func } = React.PropTypes

export default React.createClass({
  displayName: "SignIn",

  propTypes: {
    firebase: object.isRequired,
    toggleSignIn: func.isRequired
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

  handleSignInClick () {
    this.props.toggleSignIn(false)
  },

  handleContainerClick (e) {
    e.preventDefault()
    e.stopPropagation()
  },

  render () {
    return (
      <div className="sign-in" onClick={this.handleSignInClick}>
        <div className="sign-in__spacer" />
        <div className="sign-in__container" onClick={this.handleContainerClick}>
          <div className="sign-in__container-left">
            <h4>Social Sign In</h4>
            <div>Sign in to play free-form card games with your friends.</div>
            <div>Sign in will use your social profile picture, and use a unique identifier. Although we request your email, that is just part of the social sign in process.</div>
            {this.renderErrorMessage()}
            <div className="sign-in__spacer" />
          </div>
          <div className="sign-in__container-right">
            <a className="btn waves-effect waves-light yellow darken-1" href="#" onClick={this.signInAnonymously}>Anonymous</a>
            <a className="btn waves-effect waves-light grey darken-4" href="#" onClick={this.signInWithGithub}>Github</a>
          </div>
        </div>
        <div className="sign-in__spacer" />
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

