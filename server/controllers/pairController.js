'use strict'

import Pair from '../models/Pair.js'

export default class PairController {
  constructor(req, res) {
    //Checks if submitted pair is in else adds the new pair
    this.addPair = (req, res) => {
      Pair.findOne({
        name: req.params.pair
      }).exec((err, result) => {
        if (err) {
          console.error(err)
        }
        if (result) {
          res.json('This pair is already displayed.')
        } else {
          const newPair = new Pair({
            name: req.params.pair
          })
          newPair.save((err, doc) => {
            if (err) {
              console.error(err)
            }
            res.json('Saved ' + req.params.pair + ' as new currency pair.')
          })
        }
      })
    }
    //Checks if submitted pair is in else removes the pair
    this.removePair = (req, res) => {
      Pair.findOne(
        {
          name: req.params.pair
        },
        (err, result) => {
          if (err) {
            console.error(err)
          }
          if (result) {
            result.remove(err => console.error(err))
            res.json('Removed ' + result + '...')
          } else {
            res.json('No pair named ' + req.params.pair + ' found...')
          }
        }
      )
    }
    //Displays all current pairs in the browser console
    this.getAll = (req, res) => {
      Pair.find((err, result) => {
        if (err) {
          console.error(err)
        }
        res.json(result)
      })
    }

    //Saves data points for a pair
    this.saveData = (req, res) => {
      //Convert dataArr into a proper array of numbers
      const dataArr = req.params.dataArr
        .split(',')
        .map(item => parseFloat(item))
      const pair = req.params.pair

      //Find a pair
      Pair.findOne({
        name: pair
      }).exec((err, result) => {
        if (err) {
          console.error(err)
        }
        if (result) {
          //Deduplicate for same time/value points
          const temp = result.data
          temp.push(dataArr)
          const uniq = a => Array.from(new Set(a)) //Deduplicate
          result.data = uniq(temp)
          //Save
          result.save(err => {
            if (err) {
              console.error(err)
            }
            //Send response
            res.json('Saving: ' + pair + ': ' + dataArr)
          })
        } else {
          //Pair doesn't exist (has been recently deleted, etc.)
          res.json('Received data for nonexistent pair ' + pair + '...')
        }
      })
    }
  }
}
