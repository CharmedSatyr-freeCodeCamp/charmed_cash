'use strict'

/*** PACKAGES ***/
import React, { Component } from 'react'

/*** COMPONENTS ***/
import HighchartsJS from './Chart.jsx'
import Toggle from './Toggle.jsx'

/*** CONTROLLERS ***/
import common from '../controllers/common.jsx'
import socketFuncs from '../controllers/io.client.jsx'

/*** MAIN ***/
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: '',
      tickers: '',
      chartData: [],
      toggleArr: [],
      warning: ''
    }
    //    subscribeToTimer((err, timestamp) =>
    //    this.setState({
    //    timestamp
    //  })
    //)

    this.handleSubmit = this.handleSubmit.bind(this)
    this.getTickers = this.getTickers.bind(this)
    this.addTicker = this.addTicker.bind(this)
    this.deleteTicker = this.deleteTicker.bind(this)
    this.makeToggles = this.makeToggles.bind(this)
  }
  handleSubmit() {
    //Submit and start following a new trading pair
    const pair = document.getElementById('pairEntry').value

    //Check Kraken to see if it's a valid pair before adding to DB
    common.f('GET', '/api/kraFetch/' + pair, response => {
      if (response.result) {
        this.addTicker(pair)
        this.setState({ warning: ' ' + pair + ' added.' })
      } else {
        this.setState({ warning: ' Please check your input...' })
        console.log('Something is wrong with the entry. No pairs added.')
      }
    })
  }

  time() {
    common.f('GET', '/api/kraTime', response => {
      this.setState({ time: response.result.rfc1123 })
    })
  }
  getTickers() {
    //Get all tickers saved in the database
    ;(() =>
      common.f(
        'GET',
        '/api/allTickers',
        allTickers => {
          //console.log('allTickers:', allTickers) //Logs everything for debug
          const pairNames = allTickers.map(item => {
            return common.prettyTickers(item.name)
          })
          this.setState({ tickers: pairNames.join(',') })
          this.makeToggles() // Make the toggles after setting tickers

          //Get data points for chart
          const chartArr = allTickers.map(item => {
            return [common.prettyTickers(item.name), item.data]
          })
          this.setState({ chartData: chartArr })
        },
        this.fetchKraData()
      ))()
  }
  fetchKraData() {
    //Tickers from state
    const tickerArr = this.state.tickers.split(',')
    if (tickerArr.length > 1) {
      //Query Kraken for current data about the tickers
      common.f(
        'GET',
        '/api/kraFetch/' + this.state.tickers,
        response => {
          //Get the time
          common.f('GET', '/api/kraTime', time => {
            let ut = time.result.unixtime

            //Iterate through tickers we're following as keys for the kraFetch response object
            tickerArr.map(item => {
              //Create an array of format [unixtime, lasttrade] to save in the db
              let dataPoint = []
              let lt = parseFloat(response.result[item].c[0])
              dataPoint.push(ut, lt)
              //console.log(item + ':', dataPoint)

              //Send the datapoint to the database
              common.f(
                'POST',
                '/api/data/' + item + '/' + dataPoint,
                response => {
                  //console.log(response)
                }
              )
            })
          })
        },
        this.setState({ warning: '' }) //Occasionally clear warning area
      )
    }
  }
  addTicker(pair) {
    socketFuncs.addTickerWS(pair)

    common.f('POST', '/api/ar/' + pair, response => {
      console.log(response)
      this.getTickers()
    })
  }
  deleteTicker(xpair) {
    socketFuncs.removeTickerWS(xpair)

    common.f('DELETE', '/api/ar/' + xpair, response => {
      //console.log(response)
      this.getTickers()
    })
  }
  makeToggles() {
    //Create the toggles
    //Baked in pairs
    const bakedIn = 'XXBTZUSD,XETHZUSD,XZECZUSD'
    //Dynamic pairs
    const dynamic = this.state.tickers
    //Both
    let complete
    dynamic.length > 0
      ? (complete = bakedIn + ',' + dynamic)
      : (complete = bakedIn)
    let c = complete.split(',')
    //Deduplicate
    c = common.uniq(c)
    //Make the toggleArr
    const toggleArr = c.map((item, index) => {
      return (
        <Toggle
          pair={item}
          on={this.state.tickers.indexOf(item) > -1}
          add={this.addTicker}
          del={this.deleteTicker}
          key={index}
        />
      )
    })
    //set State
    this.setState({ toggleArr: toggleArr })
  }
  componentWillMount() {
    //this.deleteTicker('ffff') //debug
    this.getTickers()
    setInterval(this.getTickers, 60000)
  }
  render() {
    return (
      <div>
        <h1>Charmed Cash</h1>
        <h6>
          a realtime* digital currency ticker tracker | data from Kraken.com
          <br />
          <small>
            *i realized most of the way through that the Kraken API doesn't
            provide straightforward access to historical data, so you'll have to
            wait to accumulate some. this project was really just an chance to
            practice using web sockets anyway... in this case, that means that
            others' browsers will show your ticker toggles without a refresh
          </small>
        </h6>
        <HighchartsJS data={this.state.chartData} />
        <div>
          <label htmlFor="pairEntry">
            <h3>
              Enter a {' '}
              <a href="https://www.kraken.com/help/fees" target="_blank">
                Kraken.com trading pair
              </a>{' '}
              (e.g., DASHUSD)
            </h3>
            <input
              id="pairEntry"
              placeholder=" Type a currency pair here..."
              type="text"
            />
            <button onClick={this.handleSubmit}>POST</button>
            {this.state.warning}
          </label>
          <br />
          <h3>Or toggle a currency pair below: </h3>
          {this.state.toggleArr}
        </div>
      </div>
    )
  }
}
