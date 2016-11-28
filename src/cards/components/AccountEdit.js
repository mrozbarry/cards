import React from "react"

import * as Account from "lib/account"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "AccountEdit",

  propTypes: {
    firebase: object.isRequired,
    currentUser: object
  },

  getInitialState () {
    return {
      account: null
    }
  },

  componentWillMount () {
    const { firebase, currentUser } = this.props
    this.accountRef = Account.find(firebase, currentUser.uid)
    this.accountRef.on("value", this.handleAccountValue)
  },

  componentWillUnmount () {
    this.accountRef.off("value", this.handleAccountValue)
  },

  handleAccountValue (snapshot) {
    this.setState({
      account: snapshot.val()
    })
  },

  updatePlayerAttr (attr, e) {
    const { firebase, currentUser } = this.props

    Account.update(firebase, currentUser, {
      [attr]: e.target.value
    })
  },

  getName () {
    const { account } = this.state

    return (account ? account.name : "Anonymous") || ""
  },

  getImage () {
    const { account } = this.state

    return (account ? account.image: "") || ""
  },

  render () {
    return (
      <div className="card">
        <div className="card-content">
          <div className="row">
            <div className="col s12"><h4>Update</h4></div>
            <div className="input-field col s12">
              <input id="name" type="text" onChange={this.updatePlayerAttr.bind(this, "name")} value={this.getName()} />
              <label className="active" htmlFor="name">Name (Minumum of 3 characters)</label>
            </div>

            <div className="input-field col s12">
              <input id="image" type="text" onChange={this.updatePlayerAttr.bind(this, "image")} value={this.getImage()} />
              <label className="active" htmlFor="image">Image url</label>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
