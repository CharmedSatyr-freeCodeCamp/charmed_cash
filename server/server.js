'use strict'

/*** ES ***/
import 'babel-polyfill'

/*** EXPRESS ***/
import express from 'express'
const app = express()

/*** TOOLS ***/
import dotenv from 'dotenv'
dotenv.load()

/*** DEV TOOLS ***/
import morgan from 'morgan'
const path = process.cwd()
const DEV = process.env.NODE_ENV === 'development'
if (DEV) {
  app.use(morgan('dev'))
}

/*** VIEW ENGINE ***/
app.set('view engine', 'html')
app.engine('html', (path, option, cb) => {})

/*** MIDDLEWARE ***/
app.use('/js', express.static(path + '/dist/js')) //The first argument creates the virtual directory used in index.html
app.use('/styles', express.static(path + '/dist/styles'))

/*** MONGOOSE ***/
import mongoose from 'mongoose'
const db = mongoose.connection
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGO_URI, { useMongoClient: true }, (err, db) => {
  if (err) {
    console.error('Database failed to connect!')
  } else {
    console.log('Connected to Mongo database.')
  }
})

/*** ROUTES ***/
import routes from './routes/index.js'
routes(app)

/*** WEB SOCKETS ***/
/*import WebSocket from 'ws'
const ws = new WebSocket('wss://echo.websocket.org/', {
  origin: 'https://websocket.org'
})
ws.on('open', function open() {
  console.log('connected')
  ws.send(Date.now())
})
ws.on('close', function close() {
  console.log('disconnected')
})
ws.on('message', function incoming(data) {
  console.log(`Roundtrip time: ${Date.now() - data} ms`)
  setTimeout(function timeout() {
    ws.send(Date.now())
  }, 500)
})
*/
const port = process.env.PORT || 8080
const server = require('http').createServer(app)
const io = require('socket.io')(server)
io.on('connection', client => {
  console.log('Socket.io connection received...')

  client.on('addTickerWS', pair => {
    client.emit('logThis', 'Adding ' + pair)
  })

  client.on('removeTickerWS', pair => {
    client.emit('logThis', 'Removing ' + pair)
  })
})

server.listen(port, () => {
  console.log('Socket.io listening on port', port + '.')
})

/*** SERVE ***/
/*const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Express.js listening on port', port + '.')
})
*/
