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

//Get tickers once per second
const getTickersWS = (interval, cb) => {
  socket.on('serverGetTickersWS', response => cb(null, response))
  socket.emit('clientGetTickersWS', interval)
}

//Set the Next update timer based on getTickersWS (see Next component, io.server)
const nextUpdateWS = cb => {
  //console.log('io.client: nextUpdateWS')
  socket.on('serverNextUpdateWS', cb)
}

//Get all current trading pairs
const chartDataWS = cb => {
  //console.log('io.client: chartDataWS')
  socket.on('serverChartDataWS', cb)
  socket.emit('clientChartDataWS')
}

//Fetch data for a pair and save the data
const kraFetchSaveWS = (tickers, cb) => {
  //console.log('io.client: kraFetchSaveWS')
  socket.on('serverKraFetchSaveWS', cb)
  socket.emit('clientKraFetchSaveWS', tickers)
}

//Export object
const clientFuncsWS = {
  nextUpdateWS: nextUpdateWS,
  kraCheckerWS: kraCheckerWS,
  addTickerWS: addTickerWS,
  removeTickerWS: removeTickerWS,
  getTickersWS: getTickersWS,
  chartDataWS: chartDataWS,
  kraFetchSaveWS: kraFetchSaveWS
}

export default clientFuncsWS
