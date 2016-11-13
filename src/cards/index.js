import "./index.css"

import React from "react"
import { render } from "react-dom"

import { RouterMixin } from "react-mini-router"

import AuthMixin from "./AuthMixin"

import Home from "pages/Home"
import GamesList from "pages/GamesList"
import Game from "pages/Game"
import Profile from "pages/Profile"

import CardMenu from "components/CardMenu"
import SignIn from "components/SignIn"


import * as firebase from "firebase"

import * as firebaseEnv from "lib/firebase"

firebase.initializeApp(firebaseEnv[process.env.NODE_ENV])

const { object } = React.PropTypes

const App = React.createClass({
  displayName: "App",

  mixins: [
    RouterMixin,
    AuthMixin
  ],

  routes: {
    "/": "renderHome",
    "/games": "renderGames",
    "/games/:id": "renderGame",
    "/games/:id/edit": "renderGameWithEdit",
    "/profile": "renderProfile"
  },

  propTypes: {
    firebase: object.isRequired
  },

  getInitialState () {
    return {
      signInShow: false
    }
  },

  afterAuth () {
    this.toggleSignIn(false)
  },

  toggleSignIn (show) {
    this.setState({
      signInShow: show
    })
  },

  render () {
    if (this.state.authStateHasChanged === true) {
      return (
        <div>
          {this.renderCurrentRoute()}
          <CardMenu
            player={this.state.player}
            toggleSignIn={this.toggleSignIn}
            firebase={this.props.firebase}
            />
          {this.renderSignIn()}
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  },

  renderSignIn () {
    const { signInShow } = this.state

    if (signInShow) {
      return <SignIn firebase={firebase} toggleSignIn={this.toggleSignIn} />
    } else {
      return null
    }
  },

  renderHome () {
    return <Home firebase={firebase} player={this.state.player} />
  },

  renderNeedPlayer (component) {
    if ((this.state.player != null) && (this.state.currentUser != null)) {
      return component
    } else if (!this.state.currentUser) {
      return this.renderHome()
    } else {
      return (
        <div className="preloader-wrapper big active">
          <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
              <div className="circle" />
            </div>

            <div className="gap-patch">
              <div className="circle" />
            </div>

            <div className="circle-clipper right">
              <div className="circle" />
            </div>
          </div>
        </div>
      )
    }
  },

  renderGames () {
    return this.renderNeedPlayer(<GamesList firebase={firebase} player={this.state.player} />)
  },

  renderGame (gameId) {
    const key = `game-${gameId}`

    return this.renderNeedPlayer(<Game key={key} firebase={firebase} gameId={gameId} editMode={false} player={this.state.player} />)
  },

  renderGameWithEdit (gameId) {
    const key = `game-${gameId}`

    return this.renderNeedPlayer(<Game key={key} firebase={firebase} gameId={gameId} editMode={true} player={this.state.player} />)
  },

  renderProfile () {
    return this.renderNeedPlayer(<Profile firebase={firebase} player={this.state.player} />)
  }
})

document.addEventListener("DOMContentLoaded", () => {
  render(<App history={true} firebase={firebase} />, document.getElementById("app"))
})
