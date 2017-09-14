'use strict'

/*** MODEL ***/
import Pair from '../models/Pair.js'

/*** CONTROLLER ***/
import kraFunc from '../controllers/krakenController.server.js'

/* Pure server side data fetching/processing for tickers enabled *
     * on the client side. Fetches once per interval.                */
const kraFetchSaveWS = (message, socket, fetchInterval) => {
  console.log(
    'Server will fetch ticker data from Kraken.com every ' +
      fetchInterval / 1000 +
      ' seconds.'
  )
  socket.emit(
    message,
    'Server will fetch ticker data from Kraken.com every ' +
      fetchInterval / 1000 +
      ' seconds.'
  )
  setInterval(async () => {
    console.log('Server fetching fresh data from Kraken.com...')
    socket.emit(message, 'Server fetching fresh data from Kraken.com...')
    //Get the pairs the client saved
    new Promise((resolve, reject) => {
      Pair.find(async (err, result) => {
        if (err) {
          console.error(err)
        }
        const pairArr = result.map(item => {
          return item.name
        })
        resolve(await pairArr)
        reject('Error retrieving pair names from database...')
      })
    }).then(async response => {
      const pairArr = response
      const pairStr = response.join(',')

      //Ticker data for pairs
      const data = await kraFunc.kraFetch(pairStr)

      //Kraken server time
      const time = await kraFunc.kraTime()
      const ut = await parseFloat(time.result.unixtime)

      /* For each of the pair names retrieved, mine the data for most  *
           * recent trading price and save it in a format Highcharts likes */
      pairArr.map(item => {
        let dataPoint = []
        const price = parseFloat(data.result[item].c[0])
        dataPoint.push(ut, price)

        //Find a pair
        Pair.findOne({ name: item }, (err, doc) => {
          if (err) {
            console.error(err)
          }
          if (doc) {
            const temp = doc.data
            temp.push(dataPoint)
            const uniq = a => Array.from(new Set(a)) //Deduplicate
            doc.data = uniq(temp)
            //Save
            doc.save(err => {
              if (err) {
                console.error(err)
              }
              //Log the entry
              console.log('Saving ' + item + ': ' + dataPoint)
              socket.emit(message, 'Saving ' + item + ': ' + dataPoint)
            })
          } else {
            //Pair doesn't exists (has been recently deleted, etc.)
            console.log('Server error while capturing data...')
            socket.emit(message, 'Server error while capturing data...')
          }
        })
      })
    })
  }, fetchInterval)
}

/* Add a new ticker from the client side */
const addTickerWS = (message, socket) => {
  socket.on('addTickerWS', pair => {
    //Checks if submitted pair is in else adds the new pair
    Pair.findOne({
      name: pair
    }).exec((err, result) => {
      if (err) {
        console.error(err)
      }
      if (result) {
        socket.emit('addTickerWS', 'This pair is already displayed.')
      } else {
        const newPair = new Pair({
          name: pair
        })
        newPair.save((err, doc) => {
          if (err) {
            console.error(err)
          }
          socket.emit('addTickerWS', 'Saved new currency pair: ' + pair)
        })
      }
    })
  })
}

/* Checks whether a submitted pair is exists in the database and *
     * deletes all its data.                                         */
const removeTickerWS = (message, socket) => {
  socket.on(message, xpair => {
    Pair.findOne(
      {
        name: xpair
      },
      (err, result) => {
        if (err) {
          console.error(err)
        }
        if (result) {
          result.remove(err => console.error(err))
          socket.emit(message, 'Removing ' + xpair + '...')
        } else {
          socket.emit(message, 'No pair named ' + xpair + ' found...')
        }
      }
    )
  })
}

/* Client polls server once/interval for tickers; server pushes        *
     * updates. This keeps browsers on different devices in relative sync. *
     * This function also updates the Next Update timer on the view.       */
const getTickersWS = (message1, message2, socket) => {
  socket.on(message1, interval => {
    console.log('Client refreshing pair names with interval', interval)
    setInterval(() => {
      Pair.find((err, result) => {
        if (err) {
          console.error(err)
        }
        const pairNames = result.map(item => {
          return item.name
        })
        socket.emit(message1, pairNames.join())
        socket.emit(message2)
      })
    }, interval)
  })
}
/* Validate client pair submission with Kraken */
const kraCheckerWS = (message, socket) => {
  socket.on(message, async pair => {
    const results = await kraFunc.kraFetch(pair)
    socket.emit(message, results)
  })
}

/* Returns all current tickers with their data */
const chartDataWS = (message, socket) => {
  socket.on(message, () => {
    Pair.find((err, result) => {
      if (err) {
        console.error(err)
      }
      socket.emit(message, result)
    })
  })
}

const pairController = {
  kraFetchSaveWS: kraFetchSaveWS,
  addTickerWS: addTickerWS,
  removeTickerWS: removeTickerWS,
  getTickersWS: getTickersWS,
  kraCheckerWS: kraCheckerWS,
  chartDataWS: chartDataWS
}

export default pairController
