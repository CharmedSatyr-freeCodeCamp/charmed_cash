'use strict'

/*** ES ***/
import 'babel-polyfill'

/*** EXPRESS ***/
import express from 'express'
const app = express()

/*** ENVIRONMENT ***/
const path = process.cwd()
import dotenv from 'dotenv'
dotenv.load()

/*** DEV TOOLS ***/
import morgan from 'morgan'
const DEV = process.env.NODE_ENV === 'development'
if (DEV) {
  app.use(morgan('dev'))
}

/*** VIEW ENGINE ***/
app.set('view engine', 'html')
app.engine('html', (path, option, cb) => {})

/*** ENABLE COMPRESSION ***/
const PROD = process.env.NODE_ENV === 'production'
import compression from 'compression'
if (PROD) {
  app.use(compression())
}

/*** MIDDLEWARE ***/
app.use('/js', express.static(path + '/dist/js')) //The first argument creates the virtual directory used in index.html
app.use('/styles', express.static(path + '/dist/styles'))
app.use('/img', express.static(path + '/dist/img'))

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
app.use('/', (req, res) => {
  res.sendFile(path + '/dist/index.html')
})

/*** WEB SOCKETS ***/
import http from 'http'
const server = http.createServer(app)
import socket from 'socket.io'
const io = socket(server)
import ioEvents from './routes/io.server.js'
ioEvents(io)

/*** SERVE ***/
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Server listening on port', port + '.')
})
