'use strict'

/*** PACKAGES ***/
import React, { Component } from 'react'

/*** COMPONENTS ***/
import HighchartsJS from './Chart.jsx'
import Toggle from './Toggle.jsx'
import Next from './Next.jsx'

/*** CONTROLLERS ***/
import common from '../controllers/common.jsx'
import clientFuncsWS from '../controllers/io.client.jsx'

/*** MAIN ***/
export default class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      tickers: '',
      chartArr: [],
      toggleArr: [],
      warning: '',
      loading: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.addTicker = this.addTicker.bind(this)
    this.deleteTicker = this.deleteTicker.bind(this)
    this.makeToggles = this.makeToggles.bind(this)
    this.chartData = this.chartData.bind(this)
  }

  /* Task runner updates tickers, toggles, and displays from getTickers info */
  setTickers(tickers) {
    let set = new Promise((resolve, reject) => {
      this.setState({
        tickers: tickers
      })
      resolve(tickers)
    })
    set
      .then(result => {
        this.makeToggles()
        this.chartData()
      })
      .then(result => {
        let s
        this.state.tickers
          ? (s = 'Ready')
          : (s = 'Not following any tickers...')

        this.setState({
          loading: s
        })
      })
  }

  /* Keeps tickers in sync between client and server (allowing near real time *
   * ticker sync among users on different devices.                            */
  getTickers() {
    this.setState({ loading: 'Getting tickers...' })
    clientFuncsWS.getTickersWS(1000, (err, result) => {
      this.state.tickers === result ? console.log() : this.setTickers(result)
    })

    //If after 1500 ms there are no tickers, default makeToggles
    setTimeout(() => {
      if (!this.state.tickers) {
        this.makeToggles()
      }
    }, 1500)
  }

  /* Generate on/off buttons based on valid tickers.               *
   * Several popular Kraken pairs will always be visible.          *
   * For other Kraken pairs, turning button off = unfollowing pair */
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
  addTicker(pair) {
    clientFuncsWS.addTickerWS(pair, async response => {
      this.setState({ loading: await response })
    })
  }
  deleteTicker(xpair) {
    clientFuncsWS.removeTickerWS(xpair, async response => {
      this.setState({ loading: await response })
    })
  }
  /* Validate and save currency pair input, else warn if invalid */
  handleSubmit() {
    //Submit and start following a new trading pair
    const pair = common.prettyTickers(
      document.getElementById('pairEntry').value
    )
    this.setState({ loading: 'Validating ' + pair + '...' })
    //Check Kraken to see if it's a valid pair before adding to DB
    clientFuncsWS.kraCheckerWS(pair, response => {
      if (response.result) {
        this.addTicker(pair)
        this.setState({
          warning: ' ' + pair + ' added.'
        })
        setTimeout(() => {
          this.setState({ warning: '' })
        }, 10000)
      } else {
        this.setState({
          warning: ' Something is wrong with this entry. No pairs added.'
        })
        setTimeout(() => {
          this.setState({ warning: '' })
        }, 10000)
      }
    })
  }
  /* Chart the data saved on the server */
  chartData() {
    this.setState({ loading: 'Drawing chart...' })
    //Get data points for chart
    clientFuncsWS.chartDataWS(async result => {
      const chartArr = await result.map(item => {
        return [common.prettyTickers(item.name), item.data]
      })
      //Chart the data
      this.setState({ chartArr: chartArr, loading: 'Ready' })
    })
  }
  componentWillMount() {
    //this.deleteTicker('ffff') //debug
    this.getTickers() //Boot up
  }
  componentDidMount() {
    this.setState({ loading: 'Component mounted, awaiting tickers...' })
  }
  render() {
    return (
      <div>
        <h1>Charmed Cash</h1>
        <h3>
          a realtime* digital currency ticker tracker | data from{' '}
          <a href="https://kraken.com/" target="_blank">
            Kraken.com
          </a>
        </h3>
        <p>
          *i realized most of the way through that the Kraken API doesn't
          provide straightforward access to historical data, so you'll have to
          wait to accumulate some. this project was really just an chance to
          practice using web sockets anyway... in this case, that means that
          others' browsers will show your ticker toggles without a refresh
        </p>
        <h3>
          Currently following: {this.state.tickers.split(',').join(', ')}
          <br />
          Status: {this.state.loading}
          <br />
          <Next fn={this.chartData} />
        </h3>
        <HighchartsJS data={this.state.chartArr} />
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
