// eslint-globals FIREBASE_CONFIG

import "./index.css"

import React, { Component } from "react"
import {
  object
} from "prop-types"
import { render } from "react-dom"

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from "react-router-dom"

import Menu from "./components/Menu"

import Home from "./pages/Home"
// import GamesList from "pages/GamesList"
// import Game from "pages/Game"
// import Account from "pages/Account"

import * as firebase from "firebase"

firebase.initializeApp(FIREBASE_CONFIG)

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      currentGameKey: null
    }
  }

  // routes: {
  //   "/": "renderGames",
  //   "/games": "renderGames",
  //   "/games/:id": "renderGame",
  //   "/games/:id/edit": "renderGameWithEdit",
  //   "/account": "renderAccount"
  // },

  setCurrentGameKey (gameKey) {
    this.setState({
      currentGameKey: gameKey
    })
  }


  render () {
    return (
      <Router>
        <div>
          <Switch>
            <Route render={this.renderHome.bind(this)} />
          </Switch>

          <Menu
            firebase={this.props.firebase}
            currentUser={this.state.currentUser}
            currentGameKey={this.state.currentGameKey}
          />
        </div>
      </Router>
    )
    // if (this.state.authStateHasChanged) {
    //   return (
    //     <div key="root">
    //       {this.renderCurrentRoute()}
    //       <Menu
    //         firebase={this.props.firebase}
    //         currentUser={this.state.currentUser}
    //         currentGameKey={this.state.currentGameKey}
    //       />
    //     </div>
    //   )
    // } else {
    //   return (
    //     <div key="root">
    //       {this.renderLoading()}
    //     </div>
    //   )
    // }
  }


  renderHome () {
    return <Home firebase={firebase} player={this.state.player} />
  }


  renderGames () {
    return (
      <GamesList
        firebase={this.props.firebase}
        currentUser={this.state.currentUser}
      />
    )
  }


  renderGame (gameId) {
    const key = `game-${gameId}`

    return (
      <Game
        key={key}
        firebase={this.props.firebase}
        gameId={gameId}
        editMode={false}
        currentUser={this.state.currentUser}
        setCurrentGameKey={this.setCurrentGameKey}
      />
    )
  }


  renderGameWithEdit (gameId) {
    const key = `game-${gameId}`

    return (
      <Game
        key={key}
        firebase={this.props.firebase}
        gameId={gameId}
        editMode={true}
        currentUser={this.state.currentUser}
        setCurrentGameKey={this.setCurrentGameKey}
      />
    )
  }


  renderAccount () {
    return (
      <Account
        firebase={this.props.firebase}
        currentUser={this.state.currentUser}
      />
    )
  }


  renderLoading () {
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
}

document.addEventListener("DOMContentLoaded", () => {
  render(<App firebase={firebase} />, document.getElementById("app"))
})
