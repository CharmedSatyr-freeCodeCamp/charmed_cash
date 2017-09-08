/*** Kraken ***/
import KrakenClient from 'kraken-api'

const key = process.env.API_KEY //API Key
const secret = process.env.PRIVATE_KEY //API Private Key

const kraken = new KrakenClient(key, secret)

const kraFetch = async pairs => {
  try {
    // Get Ticker Info
    const ticker = await kraken.api('Ticker', { pair: pairs })
    return ticker
  } catch (err) {
    console.error(err)
  }
}

const kraTime = async () => {
  try {
    // Get Server Time
    const time = await kraken.api('Time')
    return time
  } catch (err) {
    console.error(err)
  }
}

const kraFunc = {
  kraTime: kraTime,
  kraFetch: kraFetch
}

export default kraFunc

/*** KRAKEN TRADE HISTORY SCRAPER -  ***/

/*
'use strict'
import KrakenClient from 'kraken-api'

const key = process.env.API_KEY //API Key
const secret = process.env.PRIVATE_KEY //API Private Key

const kraken = new KrakenClient(key, secret)

import fs from 'fs'

app.route('/api/kraHist/:pair').get(async (req, res) => {
  const pair = req.params.pair
  const history = await kraFunc.kraHist(pair, since)

  const page = history.result[pair].map(item => {
    return [item[2], item[0]]
  })
  const since = history.result.last
  res.json(history)
})

app.route('/api/kraScraper/:pair').get(async (req, res) => {
  const pair = req.params.pair
  let data = []
  const kraScraper = async (pair, since) => {
    try {
      //pull the info
      const history = await kraken.api('Trades', {
        pair: pair,
        since: since
      })
      //This is the info for the whole page
      history.result[pair].map(item => {
        const foo = '[' + item[2] + ',' + item[0] + ']'
        const poo = [item[2], item[0]]
        data.push(poo)
      })
      //this is the since value needed for the next page
      const since = history.result.last
      console.log('SINCE:', since)
      setTimeout(() => {
        fs.appendFile(path + '/tmp/test', data, err => {
          if (err) throw err
          console.log('Appended:', data)
        })
        kraScraper(pair, since)
      }, 5000) //Wait 5 seconds between pulls to avoid API limits
    } catch (err) {
      console.error(err)
    }
  }
  kraScraper(pair, 0)
  console.log(data)
})
*/
