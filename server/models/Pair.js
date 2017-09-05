'use strict'

import mongoose from 'mongoose'
const Schema = mongoose.Schema

const Pair = new Schema({
  name: String,
  data: [Array]
})

export default mongoose.model('Pair', Pair)
