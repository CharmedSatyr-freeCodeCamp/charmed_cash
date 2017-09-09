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

  app.route('/api/kraFetch/:pairStr').get(async (req, res) => {
    const results = await kraFunc.kraFetch(req.params.pairStr)
    res.json(results)
  })
  app.route('/api/kraTime').get(async (req, res) => {
    const time = await kraFunc.kraTime()
    res.json(time)
  })

  app.route('/api/allTickers').get(pairController.getAll)

  app
    .route('/api/ar/:pair')
    .post(pairController.addPair)
    .delete(pairController.removePair)

  app.route('/api/data/:pair/:dataArr').post(pairController.saveData)
}

export default routes
