import React, { Component } from "react"
import { Link } from "react-router-dom"
import { firebaseCollectionToArray } from "../lib/array"
import GamesHelper from "../helpers/GamesHelper"

import img from "../assets/old_paper_stock_02_by_ftourini-d48ubt0.png"


export default class Home extends Component {
  constructor (props) {
    super(props)

    this.state = {
      games: [],
      players: []
    }

    this.gamesHandler = new GamesHelper(this.props.firebase)
  }


  componentDidMount () {
    this.gamesHandler.onValue(this._handleGamesValue.bind(this))
  }


  componentWillUnmount () {
    this.gamesHandler.cleanup()
  }


  _handleGamesValue (snapshot) {
    this.setState({ games: firebaseCollectionToArray(snapshot.val()) })
  }


  getActiveGamesCount () {
    return this.state.games.length
  }


  getOpenGamesCount () {
    return this.state.games.filter((game) => {
      return Object.keys(game.players || {}).length < game.maxPlayers
    }).length
  }


  getPlayersOnline () {
    return this.state.players.filter((player) => player.state == "online").length
  }


  render () {
    return (
      <div>
        <div style={{ fontFamily: "'Dust West', sans", margin: "0 auto", padding: "32px", paddingRight: "85px", backgroundRepeat: "no-repeat", backgroundSize: "contain", backgroundImage: `url(${img})`, width: "900px", height: "1199px",  }}>
          <h1 style={{ textAlign: "center", fontSize: "150px" }}>~ Wanted ~</h1>
          <h2 style={{ textAlign: "center" }}>Card Players</h2>

          <ol style={{ listStyle: "none", margin: 0, padding: "64px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginTop: "-16px" }}>
            {this.state.games.filter(({ visible }) => visible).map(this.renderGame)}
          </ol>
        </div>
      </div>
    )
  }


  renderGame (game) {
    const href = `/games/${game._id}`
    return (
      <li key={game._id} style={{ width: "70%", border: "5px black solid", padding: "16px", margin: "16px" }}>
        <h3 style={{ marginBottom: "8px" }}>
          <Link to={href} style={{ color: "#444" }}>{game.name}</Link>
        </h3>
        <span style={{ fontSize: "18px" }}>Is a <strong>public</strong> game with <u>{Object.keys(game.players).length}</u> players.</span>
      </li>
    )
  }
}
