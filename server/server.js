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
app.use('/favicon', express.static(path + '/dist/favicon.ico')) //The first argument creates the virtual directory used in index.html

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
import http from 'http'
const server = http.createServer(app)
import socket from 'socket.io'
const io = socket(server)
import ioFuncs from './routes/io.server.js'
ioFuncs(io)

/*** SERVE ***/
const port = process.env.PORT || 8080
server.listen(port, () => {
  console.log('Socket.io listening on port', port + '.')
})
