'use strict'

import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8080')

//Check whether an input is a Kraken trading pair
const kraCheckerWS = (pair, cb) => {
  //console.log('io.client: clientKraCheckerWS')
  socket.on('serverKraCheckerWS', cb)
  socket.emit('clientKraCheckerWS', pair)
}

//Add a new trading pair
const addTickerWS = (pair, cb) => {
  //console.log('io.client: addTickerWS')
  socket.on('serverAddTickerWS', cb)
  socket.emit('clientAddTickerWS', pair)
}

//Remove a trading pair
const removeTickerWS = (xpair, cb) => {
  //console.log('io.client: removeTickerWS')
  socket.on('serverRemoveTickerWS', cb)
  socket.emit('clientRemoveTickerWS', xpair)
}

const getNamesWS = cb => {
  socket.on('serverGetNamesWS', response => cb(null, response))
  socket.emit('clientGetNamesWS', 1000)
}

//Get all current trading pairs
const getTickersWS = cb => {
  //console.log('io.client: getTickersWS')
  socket.on('serverGetTickersWS', cb)
  socket.emit('clientGetTickersWS')
}

//Fetch data for a pair and save the data
const kraFetchSaveWS = (tickers, cb1, cb2) => {
  //console.log('io.client: kraFetchSaveWS')
  socket.on('serverKraFetchSaveWS', cb1, cb2)
  socket.emit('clientKraFetchSaveWS', tickers)
}

//Export object
const clientFuncsWS = {
  kraCheckerWS: kraCheckerWS,
  addTickerWS: addTickerWS,
  removeTickerWS: removeTickerWS,
  getNamesWS: getNamesWS,
  getTickersWS: getTickersWS,
  kraFetchSaveWS: kraFetchSaveWS
}

export default clientFuncsWS
