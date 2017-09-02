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
