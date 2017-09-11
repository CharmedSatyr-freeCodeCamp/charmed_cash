'use strict'
import Pair from '../models/Pair.js'
import kraFunc from '../controllers/krakenController.js'

const ioFuncs = io => {
  io.on('connection', client => {
    console.log('Socket.io connection received...')

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
            client.emit('serverAddTickerWS', 'Saved new currency pair:' + pair)
          })
        }
      })
    })

    //Checks if submitted pair is in else removes the pair
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
            client.emit('serverRemoveTickerWS', 'Removed ' + xpair + '...')
          } else {
            client.emit(
              'serverRemoveTickerWS',
              'No pair named ' + xpair + ' found...'
            )
          }
        }
      )
    })

    //Client polls server once per interval for tickers; server pushes updates
    client.on('clientGetNamesWS', interval => {
      console.log('Client getting names with interval', interval)
      setInterval(() => {
        Pair.find((err, result) => {
          if (err) {
            console.error(err)
          }
          const pairNames = result.map(item => {
            return item.name
          })
          client.emit('serverGetNamesWS', pairNames.join())
        })
      }, interval)
    })

    //Check if pair is a valid Kraken pair
    client.on('clientKraCheckerWS', async pair => {
      //console.log('io.server: serverKraCheckerWS')
      const results = await kraFunc.kraFetch(pair)
      client.emit('serverKraCheckerWS', results)
    })

    //Displays all current pairs in the browser console
    client.on('clientGetTickersWS', () => {
      //console.log('server.io: clientGetTickersWS')
      Pair.find((err, result) => {
        if (err) {
          console.error(err)
        }
        client.emit('serverGetTickersWS', result)
      })
    })

    client.on('clientKraFetchSaveWS', async pairStr => {
      //console.log('io.server: clientKraFetchSaveWS')
      const pairArr = pairStr.split(',')
      const results = await kraFunc.kraFetch(pairStr)
      //Get the time
      const time = await kraFunc.kraTime()
      const ut = await parseFloat(time.result.unixtime)
      pairArr.map(item => {
        let dataPoint = []
        const price = parseFloat(results.result[item].c[0])
        dataPoint.push(ut, price)
        //Find a pair
        Pair.findOne(
          {
            name: item
          },
          (err, result) => {
            if (err) {
              console.error(err)
            }
            if (result) {
              const temp = result.data
              temp.push(dataPoint)
              const uniq = a => Array.from(new Set(a)) //Deduplicate for same time/value points
              result.data = uniq(temp)
              // Save
              result.save(err => {
                if (err) {
                  console.error(err)
                }
                // Send response
                client.emit(
                  'serverKraFetchSaveWS',
                  'Saving ' + item + ': ' + dataPoint
                )
              })
            } else {
              //Pair doesn't exist (has been recently deleted, etc.)
              client.emit(
                'serverKraFetchSaveWS',
                'Received data for nonexistent pair ' + item + '...'
              )
            }
          }
        )
      })
    })
  })
}

export default ioFuncs
