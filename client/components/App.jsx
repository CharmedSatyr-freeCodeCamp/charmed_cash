'use strict'

//PACKAGES
import React, { Component } from 'react'

//FUNCTIONS
import common from '../common/common.jsx'

//MAIN
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: '',
      tickers: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  time() {
    common.f('GET', '/api/kraTime', response => {
      this.setState({ time: response.result.rfc1123 })
    })
  }
  getTickers() {
    //Get all tickers saved in the database
    let pairArr = []

    fetch('/api/allTickers', { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        console.log('data:', data)
        data.map(item => {
          pairArr.push(item.name)
        })
      })
      .then(data => {
        const pairStr = pairArr.join()
        console.log('pairStr:', pairStr)
        this.setState({ tickers: pairStr })
      })
      .then(data => this.fetchExisting())
      .catch(err => console.error(err))
  }

  fetchExisting() {
    if (this.state.tickers) {
      common.f('GET', '/api/kraFetch/' + this.state.tickers, response => {
        console.log(response)
      })
    }
  }
  handleSubmit() {
    const pair = document.getElementById('pairEntry').value
    common.f('POST', '/api/ar/' + pair, response => console.log(response))
  }

  componentWillMount() {
    this.time()
    this.getTickers()

    const xpair = 'ZXBTXUSD'
    common.f('DELETE', '/api/ar/' + xpair, response => console.log(response)) //This works
  }
  render() {
    return (
      <div>
        <h1>Lets make some cash!</h1>
        <h3>
          Kraken.com's server time:&nbsp;
          {this.state.time}
        </h3>
        <div>
          <label htmlFor="pairEntry">
            <input
              id="pairEntry"
              placeholder=" Type a trading pair here..."
              type="text"
            />
            <button onClick={this.handleSubmit}>POST</button>
          </label>
          <h3>
            Following these tickers: {this.state.tickers}
          </h3>
        </div>
      </div>
    )
  }
}
