'use strict'
import Pair from '../models/Pair.js'
import kraFunc from '../controllers/krakenController.js'

const ioFuncs = io => {
  io.on('connection', client => {
    console.log('Socket.io connection received...')

    /* Pure server side data fetching/processing for tickers enabled *
     * on the client side                                            */
    const fetchInterval = 60000
    console.log('Server fetching data with interval ' + fetchInterval)
    setInterval(async () => {
      console.log('Server fetching fresh data from Kraken...')
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
              })
            } else {
              //Pair doesn't exists (has been recently deleted, etc.)
              console.log('Server error while capturing data...')
            }
          })
        })
      })
    }, fetchInterval)

    /* Add a new ticker from the client side */
    client.on('clientAddTickerWS', pair => {
      //console.log('server.io: clientAddTickerWS')
      //Checks if submitted pair is in else adds the new pair
      Pair.findOne({
        name: pair
      }).exec((err, result) => {
        if (err) {
          console.error(err)
        }
        if (result) {
          client.emit('serverAddTickerWS', 'This pair is already displayed.')
        } else {
          const newPair = new Pair({
            name: pair
          })
          newPair.save((err, doc) => {
            if (err) {
              console.error(err)
            }
            client.emit('serverAddTickerWS', 'Saved new currency pair: ' + pair)
          })
        }
      })
    })

    /* Checks whether a submitted pair is exists in the database and *
     * deletes all its data.                                         */
    client.on('clientRemoveTickerWS', xpair => {
      //console.log('server.io: clientRemoveTickerWS')
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
            client.emit('serverRemoveTickerWS', 'Removing ' + xpair + '...')
          } else {
            client.emit(
              'serverRemoveTickerWS',
              'No pair named ' + xpair + ' found...'
            )
          }
        }
      )
    })

    /* Client polls server once/interval for tickers; server pushes       *
     * updates. This keeps browsers on different devies in relative sync. */
    client.on('clientGetTickersWS', interval => {
      console.log('Client getting names with interval', interval)
      setInterval(() => {
        Pair.find((err, result) => {
          if (err) {
            console.error(err)
          }
          const pairNames = result.map(item => {
            return item.name
          })
          client.emit('serverGetTickersWS', pairNames.join())
        })
      }, interval)
    })

    /* Validate client pair submission with Kraken */
    client.on('clientKraCheckerWS', async pair => {
      //console.log('io.server: serverKraCheckerWS')
      const results = await kraFunc.kraFetch(pair)
      client.emit('serverKraCheckerWS', results)
    })

    /* Displays all current pairs in the browser console */
    client.on('clientChartDataWS', () => {
      //console.log('server.io: clientChartDataWS')
      Pair.find((err, result) => {
        if (err) {
          console.error(err)
        }
        client.emit('serverChartDataWS', result)
      })
    })
  })
}

export default ioFuncs
