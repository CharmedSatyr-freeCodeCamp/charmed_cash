'use strict'

const path = process.cwd()
const DEV = process.env.NODE_ENV === 'development'

import kraFetch from '../common/kraken.js'

const routes = app => {
  let pairArr = ['XZECZUSD']
  pairArr.push('XXBTZUSD')
  const pairsStr = pairArr.join()

  app.route('/').get((req, res) => {
    res.sendFile(path + '/client/src/index.html')
  })

  app.route('/api/kraFetch').get(async (req, res) => {
    const results = await kraFetch(pairsStr)
    res.json(results)
  })
}

export default routes
