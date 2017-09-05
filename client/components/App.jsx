'use strict'

/*** PACKAGES ***/
import React, { Component } from 'react'

/*** COMPONENTS ***/
import HighchartsJS from './Chart.jsx'

/*** FUNCTIONS ***/
import common from '../common/common.jsx'

/*** TOOLS ***/
//import dotenv from 'dotenv'
//dotenv.load()
//const DEV = process.env.NODE_ENV === 'development'

/*** MAIN ***/
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: '',
      tickers: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit() {
    //Submit and start following a new trading pair
    const pair = document.getElementById('pairEntry').value
    common.f('POST', '/api/ar/' + pair, response => console.log(response))
  }
  time() {
    common.f('GET', '/api/kraTime', response => {
      this.setState({ time: response.result.rfc1123 })
    })
  }
  getTickers() {
    //Get all tickers saved in the database
    ;(async () => {
      try {
        const allTickers = await fetch('/api/allTickers')
        const data = await allTickers.json()
        console.log('allTickers:', data)
        const pairNames = data.map(item => {
          return item.name
        })
        this.setState({ tickers: pairNames.join(',') })
      } catch (e) {
        console.error(e)
      } finally {
        this.fetchKraData()
      }
    })()
  }

  fetchKraData() {
    //Tickers from state
    const tickerArr = this.state.tickers.split(',')

    //Query Kraken for current data about the tickers
    common.f('GET', '/api/kraFetch/' + this.state.tickers, response => {
      //Get the time
      common.f('GET', '/api/kraTime', time => {
        let ut = time.result.unixtime

        //Iterate through tickers we're following as keys for the kraFetch response object
        tickerArr.map(item => {
          //Create an array of format [unixtime, lasttrade] to save in the db
          let dataPoint = []
          let lt = parseFloat(response.result[item].c[0])
          console.log(typeof lt)
          dataPoint.push(ut, lt)
          console.log(item + ':', dataPoint)

          //Send the datapoint to the database
          common.f('POST', '/api/data/' + item + '/' + dataPoint, response =>
            console.log(response)
          )
        })
      })
    })
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
        <h4>HighchartsJS</h4>
        <HighchartsJS />
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
