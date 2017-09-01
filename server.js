'use strict'

/*** ES ***/
import 'babel-polyfill'

/*** EXPRESS ***/
import express from 'express'
const app = express()

/*** DEV TOOLS ***/
import morgan from 'morgan'
const path = process.cwd()
const DEV = process.env.NODE_ENV === 'development'
if (DEV) {
  app.use(morgan('dev'))
}
import dotenv from 'dotenv'
dotenv.load()

/*** VIEW ENGINE ***/
app.set('view engine', 'html')
app.engine('html', (path, option, cb) => {})

/*** ROUTES ***/
import routes from './routes/index.js'
routes(app)

/*** SERVE ***/
const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log('Node.js listening on port', port + '.')
})
