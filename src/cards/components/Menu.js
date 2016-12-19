import "./Menu.css"

import React from "react"

import * as Game from "lib/game"

const { object, string } = React.PropTypes

export default React.createClass({
  displayName: "Menu",

  propTypes: {
    firebase: object.isRequired,
    currentUser: object,
    currentGameKey: string
  },


  mixins: [
    Game.GameListenerMixin({ saveToStateKey: "game", gameKeyFromPropKey: "currentGameKey"})
  ],


  getInitialState () {
    return {
      toggleOpen: false,
      error: null
    }
  },


  toggleMenu (e) {
    e.preventDefault()

    this.setState({
      toggleOpen: !this.state.toggleOpen
    })
  },


  signInAnonymously (e) {
    e.preventDefault()

    this.props.firebase.auth().signInAnonymously().catch((error) => {
      this.setState({ error: error })
    })
  },


  signInWithGithub (e) {
    e.preventDefault()

    const provider = new this.props.firebase.auth.GithubAuthProvider()

    this.props.firebase.auth().signInWithPopup(provider).catch((error) => {
      this.setState({ error: error })
    })
  },


  signOut (e) {
    const { firebase } = this.props
    e.preventDefault()
    firebase.auth().signOut()
  },


  joinGame (e) {
    const { firebase, currentUser } = this.props
    const { game } = this.state

    e.preventDefault()

    if (!Game.joinGame(firebase, game, currentUser)) {
      alert("Looks like something went wrong, you don't have a game available to join.")
    }
  },


  leaveGame (e) {
    const { firebase, currentUser } = this.props
    const { game } = this.state

    e.preventDefault()

    if (!Game.leaveGame(firebase, game, currentUser)) {
      alert("Looks like something went wrong, you don't have a game available to leave.")
    }
  },


  getMenuClass () {
    if (this.state.toggleOpen) {
      return "menu menu--opened"
    } else {
      return "menu"
    }
  },


  render () {
    return (
      <div className={this.getMenuClass()}>
        <a className="menu-item menu-item--dark" href="#" onClick={this.toggleMenu}>
          <div className="menu-item__icon fa fa-bars" />
          <div className="menu-item__text">Cards</div>
        </a>

        {this.renderAccountLinks()}

        <hr className="menu-separator" />

        <a className="menu-item menu-item--highlight" href="/">
          <div className="menu-item__icon fa fa-play" />
          <div className="menu-item__text">All Games</div>
        </a>

        {this.renderGameLinks()}

        {this.renderSignOut()}

        <div style={{ flexGrow: 1 }} />

        <div className="menu-item">
          <div className="menu-item__icon material-icons">info_outline</div>
          <div className="menu-item__text">Created for <a target="_blank" href="http://www.nodeknockout.com">NodeKnockout 2016</a></div>
        </div>

      </div>
    )
  },


  renderAccountLinks () {
    if (this.props.currentUser) {
      return [
        <hr key="sep" className="menu-separator" />
        ,
        <a key="account" className="menu-item menu-item--highlight" href="/account">
          <div className="menu-item__icon material-icons">account_box</div>
          <div className="menu-item__text">My Account</div>
        </a>
      ]
    } else {
      return [
        <hr key="sep" className="menu-separator" />
        ,
        <a key="signin-anonymous" className="menu-item menu-item--highlight" onClick={this.signInAnonymously} href="#anonymous">
          <div className="menu-item__icon fa fa-user-secret" aria-hidden="true" />
          <div className="menu-item__text">Anonymously</div>
        </a>
        // ,
        // <a key="signin-github" className="menu-item menu-item--highlight" onClick={this.signInWithGithub} href="#github">
        //   <div className="menu-item__icon fa fa-github-alt" />
        //   <div className="menu-item__text">With Github</div>
        // </a>
      ]
    }
  },


  renderGameLinks () {
    const { currentGameKey, currentUser } = this.props
    const { game } = this.state

    if (!currentGameKey) {
      return null
    }
    let gameLinks = []

    if (Game.isParticipating(game, currentUser)) {
      gameLinks.push(
        <a key="leave" className="menu-item menu-item--highlight" href="#" onClick={this.leaveGame}>
          <div className="menu-item__icon material-icons">remove</div>
          <div className="menu-item__text">Leave Game</div>
        </a>
      )
    } else if (Game.canJoin(game, currentUser)) {
      gameLinks.push(
        <a key="join" className="menu-item menu-item--highlight" href="#" onClick={this.joinGame}>
          <div className="menu-item__icon material-icons">add</div>
          <div className="menu-item__text">Join Game</div>
        </a>
      )
    }

    // TODO
    if (game && currentUser && game.ownerId === currentUser.uid) {
      const editUrl = `/games/${currentGameKey}/edit`
      gameLinks.push(
        <a key="edit" className="menu-item menu-item--highlight" href={editUrl}>
          <div className="menu-item__icon fa fa-pencil" aria-hidden="true"></div>
          <div className="menu-item__text">Edit Game</div>
        </a>
      )
    }

    return gameLinks
  },


  renderSignOut () {
    if (!this.props.currentUser) {
      return null
    }

    return (
      <a className="menu-item menu-item--highlight" onClick={this.signOut} href="#signout">
        <div className="menu-item__icon material-icons">exit_to_app</div>
        <div className="menu-item__text">Sign Out</div>
      </a>
    )
  },


  renderMenuLink (text, url, options) {
    const opts = Object.assign({
      key: null,
      icon: null,
      highlight: false
    }, options)

    let menuItemClasses = ["menu-item"]
    if (opts.highlight) {
      menuItemClasses = menuItemClasses.concat("menu-item--highlight")
    }

    let menuItemIconClasses = ["menu-item__icon"]
    if (opts.icon) {
      menuItemIconClasses = menuItemIconClasses.concat("material-icons")
    }

    return (
      <a key={opts.key} className={menuItemClasses.join(" ")} href={url}>
        <div className={menuItemIconClasses.join(" ")}>{opts.icon}</div>
        <div className="menu-item__text">{text}</div>
      </a>
    )
  }
})
