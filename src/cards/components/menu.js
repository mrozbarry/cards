import React from "react"

const { object } = React.PropTypes

export default React.createClass({
  displayName: "menu",

  propTypes: {
    firebase: object.isRequired
  },

  render () {
    return (
      <div>
        <ol>
          <li>Home</li>
          <li>Games</li>
          <li>Profile</li>
        </ol>

      </div>
    )
  }
})

