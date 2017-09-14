'use strict'

/*** ENVIRONMENT ***/
import dotenv from 'dotenv'
dotenv.load()

/*** CREATE CLIENT SOCKETS ***/
import openSocket from 'socket.io-client'
const clientSocket = openSocket(process.env.APP_URL)

/*** CLIENT-SIDE WEBSOCKET EVENT FUNCTIONS ***/
//Receives notifications from server on fetching and saving new Kraken data
const kraFetchSaveWS = cb => {
  clientSocket.on('kraFetchSaveWS', cb)
}

//Check whether an input is a Kraken trading pair
const kraCheckerWS = (pair, cb) => {
  clientSocket.on('kraCheckerWS', cb)
  clientSocket.emit('kraCheckerWS', pair)
}

//Add a new trading pair
const addTickerWS = (pair, cb) => {
  clientSocket.on('addTickerWS', cb)
  clientSocket.emit('addTickerWS', pair)
}

//Remove a trading pair
const removeTickerWS = (xpair, cb) => {
  clientSocket.on('removeTickerWS', cb)
  clientSocket.emit('removeTickerWS', xpair)
}

//Get tickers once per second
const getTickersWS = (interval, cb) => {
  clientSocket.on('getTickersWS', response => cb(null, response))
  clientSocket.emit('getTickersWS', interval)
}

//Set the Next update timer based on getTickersWS (see Next component, io.server)
const nextUpdateWS = cb => {
  clientSocket.on('nextUpdateWS', cb)
}

//Get all current trading pairs
const chartDataWS = cb => {
  clientSocket.on('chartDataWS', cb)
  clientSocket.emit('chartDataWS')
}

//Export object
const clientFuncsWS = {
  kraFetchSaveWS: kraFetchSaveWS,
  nextUpdateWS: nextUpdateWS,
  kraCheckerWS: kraCheckerWS,
  addTickerWS: addTickerWS,
  removeTickerWS: removeTickerWS,
  getTickersWS: getTickersWS,
  chartDataWS: chartDataWS
}

export default clientFuncsWS
