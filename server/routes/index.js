'use strict'
const path = process.cwd()
const DEV = process.env.NODE_ENV === 'development'

import PairController from '../controllers/pairController.js'
const pairController = new PairController()

import kraFunc from '../controllers/krakenController.js'

const routes = app => {
  app.route('/').get((req, res) => {
    res.sendFile(path + '/dist/index.html')
  })

  app.route('/api/kraFetch/').get((req, res) => {
    res.json('No trading pair submitted...')
  })
}

export default routes
