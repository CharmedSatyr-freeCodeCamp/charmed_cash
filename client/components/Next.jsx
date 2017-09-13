'use strict'

/*** PACKAGES ***/
import React, { Component } from 'react'

/*** FUNCTIONS ***/
import clientFuncsWS from '../controllers/io.client.jsx'

/*** MAIN ***/
export default class Next extends Component {
  constructor(props) {
    super(props)
    this.state = {
      counter: 60
    }
  }
  nextUpdate() {
    clientFuncsWS.nextUpdateWS(() => {
      if (this.state.counter === 0) {
        this.setState({ counter: 60 })
        this.props.fn()
      } else {
        this.setState({ counter: this.state.counter - 1 })
      }
    })
  }
  componentDidMount() {
    this.nextUpdate()
  }
  render() {
    return (
      <div>
        Next update: {this.state.counter}
      </div>
    )
  }
}
