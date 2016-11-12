require("index.css")

import React from "react"
import { render } from "react-dom"

import { RouterMixin } from "react-mini-router"

import Home from "pages/Home"
import GamesList from "pages/GamesList"
import Game from "pages/Game"
import Profile from "pages/Profile"

import CardMenu from "components/CardMenu"
import SignIn from "components/SignIn"


import * as firebase from "firebase"

import * as firebaseEnv from "lib/firebase"

firebase.initializeApp(firebaseEnv[process.env.NODE_ENV])

const App = React.createClass({
  displayName: "App",

  mixins: [
    RouterMixin
  ],

  routes: {
    "/": "renderHome",
    "/games": "renderGames",
    "/games/:id": "renderGame",
    "/profile": "renderProfile"
  },

  getInitialState () {
    return {
      signInShow: false,
      user: null
    }
  },

  componentWillMount () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user,
          signInShow: false,
          signInMessage: null
        })
      } else {
        this.setState({
          user: null
        })
      }
    })
  },

  toggleSignIn (show) {
    console.log("toggleSignIn", show)
    this.setState({
      signInShow: show
    })
  },

  render () {
    return (
      <div>
        {this.renderCurrentRoute()}
        <CardMenu
          user={this.state.user}
          toggleSignIn={this.toggleSignIn}
          auth={firebase.auth()}
          />
        {this.renderSignIn()}
      </div>
    )
  },

  renderSignIn () {
    const { signInShow } = this.state

    if (signInShow) {
      return <SignIn auth={firebase.auth()} />
    } else {
      return null
    }
  },

  renderHome () {
    return <Home firebase={firebase} />
  },

  renderGames () {
    return <GamesList firebase={firebase} />
  },

  renderGame (gameId) {
    return <Game firebase={firebase} gameId={gameId} />
  },

  renderProfile () {
    return <Profile firebase={firebase} />
  }
})

document.addEventListener("DOMContentLoaded", () => {
  render(<App />, document.getElementById("app"))
})
