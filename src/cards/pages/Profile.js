import React from "react"

import GamesMixin from "GamesMixin"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "Profile",

  mixins: [
    GamesMixin
  ],

  propTypes: {
    firebase: object.isRequired,
    player: object
  },

  getInitialState () {
    const { player } = this.props
    return {
      nextName: player ? player.name : "",
      nextImage: player ? player.image : ""
    }
  },

  componentWillReceiveProps (nextProps) {
    if ((this.props.player != nextProps.player) && nextProps.player) {
      this.setState({
        nextName: nextProps.player.name,
        nextImage: nextProps.player.image
      })
    }
  },

  nameChange (e) {
    this.setState({
      nextName: e.target.value
    })
  },

  imageChange (e) {
    this.setState({
      nextImage: e.target.value
    })
  },

  updatePlayer () {
    const { firebase, player } = this.props

    firebase.database().ref("players").child(player.userId).update({
      name: this.state.nextName,
      image: this.state.nextImage
    })
  },

  profileGames () {
    const { player } = this.props
    return this.state.games.filter((game) => game.ownerId === player.userId)
  },

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <h1 className="white-text">Player Profile</h1>
          </div>
        </div>

        <div className="row">
          <div className="col s6">
            <div className="card">
              <div className="card-content">
                <div className="row">
                  <div className="col s12"><h4>Update</h4></div>
                  <div className="input-field col s12">
                    <input placeholder="John Doe" id="name" type="text" className="validate" pattern=".{3,}" onChange={this.nameChange} value={this.state.nextName} />
                    <label htmlFor="name">Name (Minumum of 3 characters)</label>
                  </div>

                  <div className="input-field col s12">
                    <input placeholder="http://..." id="image" type="text" onChange={this.imageChange} value={this.state.nextImage} />
                    <label htmlFor="image">Image url</label>
                  </div>
                </div>
              </div>
              <div className="card-action">
                <a href="#" onClick={this.updatePlayer}>Save</a>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <h1 className="white-text">Your Games</h1>
          </div>
        </div>
      </div>
    )
  }
})
