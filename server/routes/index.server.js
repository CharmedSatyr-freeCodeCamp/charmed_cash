'use strict'

const path = process.cwd()

const routes = app => {
  app.route('/*').get((req, res) => {
    res.sendFile(path + '/dist/index.html')
  })
}

export default routes
