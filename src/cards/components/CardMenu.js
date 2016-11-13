import "./CardMenu.css"
import React from "react"

import { navigate } from "react-mini-router"

const { object, func } = React.PropTypes

export default React.createClass({
  displayName: "CardMenu",

  propTypes: {
    toggleSignIn: func.isRequired,
    firebase: object.isRequired,
    player: object
  },

  openSignIn (e) {
    e.preventDefault()

    this.props.toggleSignIn(true)
  },

  signOut (e) {
    const { firebase, player } = this.props
    e.preventDefault()

    firebase.database().ref("players").child(player.userId).child("online").set(false).then(() => {
      this.props.firebase.auth().signOut()
      navigate("/")
    })
  },

  componentWillReceiveProps (nextProps) {
    if (this.props.player != nextProps.player) {
      window.$(this.actionButton).closeFAB()
    }
  },

  render () {
    return (
      <div>
        <div ref={(ele) => this.actionButton = ele} className="fixed-action-btn horizontal click-to-toggle" style={{ position: "absolute", top: "24px", right: "24px", height: "70px" }}>
          {this.renderMenuLink()}
          <ul>
            {this.renderMenuItems()}
          </ul>
        </div>
        <a href="https://www.nodeknockout.com/entries/222-fuelled-by-coffee" target="_blank" style={{ position: "absolute", top: "90px", right: "12px" }}>
          <img src={require("assets/voteko.png")} style={{ width: "auto", height: "40px" }} alt="Vote for us on NodeKnockout!" />
        </a>
      </div>
    )
  },

  renderMenuLink () {
    const { player } = this.props

    if (player) {
      return (
        <a className="btn-floating btn-large" style={{ backgroundImage: `url(${player.image})`, backgroundSize: "cover" }} />
      )
    } else {
      return (
        <a className="btn-floating btn-large pink">
          <i className="large material-icons">menu</i>
        </a>
      )
    }
  },

  renderMenuItems () {
    let menuItems = [
    ]
    menuItems = this.addMenuItem(menuItems, { color: "amber", icon: "home", href: "/" })

    if (this.props.player) {
      menuItems = this.addMenuItem(menuItems, { color: "red", icon: "games", href: "/games" })
      menuItems = this.addMenuItem(menuItems, { color: "blue", icon: "face", href: "/profile" })
      menuItems = this.addMenuItem(menuItems, { color: "purple", icon: "exit_to_app", onClick: this.signOut })
    } else {
      menuItems = this.addMenuItem(menuItems, { color: "purple", icon: "person_add", onClick: this.openSignIn })
    }

    return menuItems
  },

  addMenuItem (menuItems, { color, icon, href, onClick }) {
    const className = ["btn-floating", color].join(" ")

    return menuItems.concat(
      <li key={menuItems.length}>
        <a className={className} href={href} onClick={onClick}>
          <i className="material-icons">{icon}</i>
        </a>
      </li>
    )
  }
})
