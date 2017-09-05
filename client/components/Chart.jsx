'use strict'

//PACKAGES
import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'

const dataPoints =
  // Oct 2010
  [
    [1285891200000, 40.36],
    [1286150400000, 39.81],
    [1286236800000, 41.28],
    [1286323200000, 41.31],
    [1286409600000, 41.32],
    [1286496000000, 42.01],
    [1286755200000, 42.19],
    [1286841600000, 42.65],
    [1286928000000, 42.88],
    [1287014400000, 43.19],
    [1287100800000, 44.96],
    [1287360000000, 45.43],
    [1287446400000, 44.21],
    [1287532800000, 44.36],
    [1287619200000, 44.22],
    [1287705600000, 43.92],
    [1287964800000, 44.12],
    [1288051200000, 44.01],
    [1288137600000, 43.98],
    [1288224000000, 43.61],
    [1288310400000, 43.0],
    // Nov 2010
    [1288569600000, 43.45],
    [1288656000000, 44.19],
    [1288742400000, 44.69],
    [1288828800000, 45.47],
    [1288915200000, 45.3],
    [1289174400000, 45.52],
    [1289260800000, 45.15],
    [1289347200000, 45.43],
    [1289433600000, 45.24],
    [1289520000000, 44.0],
    [1289779200000, 43.86],
    [1289865600000, 43.08],
    [1289952000000, 42.93],
    [1290038400000, 44.06],
    [1290124800000, 43.82],
    [1290384000000, 44.77],
    [1290470400000, 44.1],
    [1290556800000, 44.97],
    [1290729600000, 45.0],
    [1290988800000, 45.27],
    [1291075200000, 44.45]
  ]

//Highcharts config
const config = {
  rangeSelector: {
    selected: 1
  },
  title: {
    text: 'AAPL Stock Price'
  },
  series: [
    {
      name: 'AAPL',
      data: dataPoints,
      tooltip: {
        valueDecimals: 2
      }
    }
  ]
}

//FUNCTIONS
import common from '../common/common.jsx'

//MAIN
export default class HighchartsJS extends Component {
  componenDidMount() {
    console.log(this.refs.chart.chart_instance)
  }
  render() {
    return (
      <div>
        <ReactHighcharts config={config} />
      </div>
    )
  }
}
