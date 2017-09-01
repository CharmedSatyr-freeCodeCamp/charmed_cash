'use strict'

//PACKAGES
import 'babel-polyfill'
import React, { Component } from 'react'
import KrakenClient from 'kraken-api'

//FUNCTIONS
import common from '../common/common.jsx'

//MAIN
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: ''
    }
  }
  time() {
    const key = process.env.API_KEY // API Key
    const secret = process.env.SECRET_KEY // API Private Key
    let timeURL = 'https://api.kraken.com/0/public/Time'
    const kraken = new KrakenClient(key, secret)
    ;(async () => {
      // Display user's balance
      console.log(await kraken.api('Balance'))

      // Get Ticker Info
      console.log(await kraken.api('Ticker', { pair: 'XXBTZUSD' }))
    })()
    /*
    var myHeaders = new Headers()
    myHeaders.append('API-KEY', key)
    myHeaders.append('API-Sign', secret)
    const myInit = {
      method: 'GET',
      headers: myHeaders,
      mode: 'cors'
    }*/
    /*
    common.ajaxRequest('GET', timeURL, response => {
      console.log(response)
      this.setState({ time: response })
    })
*/
    /*
    fetch('https://api.kraken.com/0/public/Time', myInit)
      .then(result => console.log(result))
      .then(result => this.setState((time: result)))
      .catch(err => console.error(err))
      */
  }
  render() {
    this.time()
    return (
      <h1>
        Hi there! Lets make some cash! The time is {this.state.time}
      </h1>
    )
  }
}
