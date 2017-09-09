'use strict'

/*** PACKAGES ***/
import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'

/*** FUNCTIONS ***/
import common from '../controllers/common.jsx'

/*** MAIN ***/
const HighchartsJS = ({ data }) => {
  //Map data into Highcharts eries format
  const seriesArr = data.map(item => {
    return {
      name: common.prettyTickers(item[0]),
      data: common.uniq(item[1]),
      tooltip: {
        valueDecimals: 2
      }
    }
  })

  //Highcharts config
  const config = {
    chart: {
      //      animation: false, //Doesn't seem to turn off the animations!
      backgroundColor: '#ffffff'
    },
    xAxis: {
      type: 'datetime'
    },
    rangeSelector: {
      selected: 1
    },
    title: {
      text: 'Digital Currency Prices'
    },
    series: seriesArr
  }

  return (
    <div>
      <ReactHighcharts config={config} />
    </div>
  )
}

export default HighchartsJS
