import React from "react"
import { render } from "react-dom"

import { Router, Route, browserHistory } from "react-router"

import Home from "pages/Home"
import GamesList from "pages/GamesList"
import Game from "pages/Game"
import Profile from "pages/Profile"

import * as firebase from "firebase"

import * as firebaseEnv from "lib/firebase"

firebase.initializeApp(firebaseEnv[process.env.NODE_ENV])

document.addEventListener("DOMContentLoaded", () => {
  render(
    <Router history={browserHistory}>
      <Route path="/" firebase={firebase} component={Home}>
        <Route path="/games" firebase={firebase} component={GamesList}>
          <Route path="/games/:gameId" firebase={firebase} component={Game} />
        </Route>
        <Route path="/profile" firebase={firebase} component={Profile} />
        <Route path="*" status={404} firebase={firebase} component={Home} />
      </Route>
    </Router>,
    document.getElementById("app")
  )
})
