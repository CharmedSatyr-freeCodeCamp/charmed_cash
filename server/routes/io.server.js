'use strict'

/*** CONTROLLER ***/
import pairController from '../controllers/pairController.server.js'

/*** WEBSOCKETS ***/
const ioEvents = io => {
  io.on('connection', serverSocket => {
    console.log('Socket.io connection received...')

    /* Pure server side data fetching/processing for tickers enabled *
     * on the client side. Fetches once per interval.                */
    pairController.kraFetchSaveWS('kraFetchSaveWS', serverSocket, 60000)

    /* Add a new ticker from the client side */
    pairController.addTickerWS('addTickerWS', serverSocket)

    /* Checks whether a submitted pair is exists in the database and *
     * deletes all its data.                                         */
    pairController.removeTickerWS('removeTickerWS', serverSocket)

    /* Client polls server once/interval for tickers; server pushes        *
     * updates. This keeps browsers on different devices in relative sync. *
     * This function also updates the Next Update timer on the view.       */
    pairController.getTickersWS('getTickersWS', 'nextUpdateWS', serverSocket)

    /* Validate client pair submission with Kraken */
    pairController.kraCheckerWS('kraCheckerWS', serverSocket)

    /* Returns all current tickers with their data */
    pairController.chartDataWS('chartDataWS', serverSocket) //How is this worth it?
  })
}

export default ioEvents
