'use strict'

import openSocket from 'socket.io-client'
const socket = openSocket('http://localhost:8080')

const addTickerWS = pair => {
  socket.on('logThis', response => console.log(response))
  socket.emit('addTickerWS', pair)
}

const removeTickerWS = pair => {
  socket.on('logThis', response => console.log(response))
  socket.emit('removeTickerWS', pair)
}

const socketFuncs = {
  addTickerWS: addTickerWS,
  removeTickerWS: removeTickerWS
}

export default socketFuncs
