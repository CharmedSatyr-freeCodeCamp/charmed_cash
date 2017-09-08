'use strict'

/*
const (
  BCHEUR   = "BCHEUR"
	BCHUSD   = "BCHUSD"
	BCHXBT   = "BCHXBT"
	DASHEUR  = "DASHEUR"
	DASHUSD  = "DASHUSD"
	DASHXBT  = "DASHXBT"
	EOSETH   = "EOSETH"
	EOSEUR   = "EOSEUR"
	EOSUSD   = "EOSUSD"
	EOSXBT   = "EOSXBT"
	GNOETH   = "GNOETH"
	GNOEUR   = "GNOEUR"
	GNOUSD   = "GNOUSD"
	GNOXBT   = "GNOXBT"
	USDTZUSD = "USDTZUSD"
	XETCXETH = "XETCXETH"
	XETCXXBT = "XETCXXBT"
	XETCZEUR = "XETCZEUR"
	XETCXUSD = "XETCXUSD"
	XETHXXBT = "XETHXXBT"
	XETHZCAD = "XETHZCAD"
	XETHZEUR = "XETHZEUR"
	XETHZGBP = "XETHZGBP"
	XETHZJPY = "XETHZJPY"
	XETHZUSD = "XETHZUSD"
	XICNXETH = "XICNXETH"
	XICNXXBT = "XICNXXBT"
	XLTCXXBT = "XLTCXXBT"
	XLTCZEUR = "XLTCZEUR"
	XLTCZUSD = "XLTCZUSD"
	XMLNXETH = "XMLNXETH"
	XMLNXXBT = "XMLNXXBT"
	XREPXETH = "XREPXETH"
	XREPXXBT = "XREPXXBT"
	XREPZEUR = "XREPZEUR"
	XREPZUSD = "XREPZUSD"
	XXBTZCAD = "XXBTZCAD"
	XXBTZEUR = "XXBTZEUR"
	XXBTZGBP = "XXBTZGBP"
	XXBTZJPY = "XXBTZJPY"
	XXBTZUSD = "XXBTZUSD"
	XXDGXXBT = "XXDGXXBT"
	XXLMXXBT = "XXLMXXBT"
	XXLMZEUR = "XXLMZEUR"
	XXLMZUSD = "XXLMZUSD"
	XXMRXXBT = "XXMRXXBT"
	XXMRZEUR = "XXMRZEUR"
	XXMRZUSD = "XXMRZUSD"
	XXRPXXBT = "XXRPXXBT"
	XXRPZCAD = "XXRPZCAD"
	XXRPZEUR = "XXRPZEUR"
	XXRPZJPY = "XXRPZJPY"
	XXRPZUSD = "XXRPZUSD"
	XZECXXBT = "XZECXXBT"
	XZECZEUR = "XZECZEUR"
	XZECZUSD = "XZECZUSD"
)
*/

/*** PACKAGES ***/
import React, { Component } from 'react'

/*** COMPONENTS ***/
import HighchartsJS from './Chart.jsx'
import Toggle from './Toggle.jsx'

/*** FUNCTIONS ***/
import common from '../controllers/common.jsx'

/*** MAIN ***/
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      time: '',
      tickers: '',
      chartData: [],
      toggleArr: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getTickers = this.getTickers.bind(this)
    this.addTicker = this.addTicker.bind(this)
    this.deleteTicker = this.deleteTicker.bind(this)
    this.makeToggles = this.makeToggles.bind(this)
  }

  handleSubmit() {
    //Submit and start following a new trading pair
    const pair = document.getElementById('pairEntry').value
    const regex = /[A-Z]{6,8}\.?d?/i
    pair.match(regex)
      ? this.addTicker(pair)
      : console.log('Something is wrong with the entry. No pairs added.')
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
      common.f('GET', '/api/kraFetch/' + this.state.tickers, response => {
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
      })
    }
  }
  addTicker(pair) {
    common.f('POST', '/api/ar/' + pair, response => {
      //console.log(response)
      this.getTickers()
    })
  }
  deleteTicker(xpair) {
    common.f('DELETE', '/api/ar/' + xpair, response => {
      //console.log(response)
      this.getTickers()
    })
  }
  makeToggles() {
    //Create the toggles
    //Baked in pairs
    const bakedIn =
      'XZECZUSD,XXBTZUSD,XETHZUSD,XXBTZEUR,XETHZXBT,XETHZEUR,XETCZETH,XETCZUSD,XETCZEUR,XREPZXBT,XREPZETH,XREPZEUR'
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
        <h1>
          Charmed Cash
          <br />
          <small>
            a realtime* digital currency ticker tracker | data from Kraken.com
            <h6>
              *i realized most of the way through that the Kraken API doesn't
              provide straightforward access to historical data, so you'll have
              to wait to accumulate some. this project was really just an chance
              to practice using web sockets anyway... in this case, that means
              that others' browsers will show your ticker toggles without a
              refresh
            </h6>
          </small>
        </h1>
        <HighchartsJS data={this.state.chartData} />
        <div>
          <label htmlFor="pairEntry">
            <h3>
              Enter a custom{' '}
              <a href="https://www.kraken.com/help/fees">
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
          </label>
          <br />
          <h3>Or toggle a currency pair below: </h3>
          {this.state.toggleArr}
        </div>
      </div>
    )
  }
}
