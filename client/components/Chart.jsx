'use strict'

/*** PACKAGES ***/
import React, { Component } from 'react'
import Highcharts from 'highcharts'
import ReactHighcharts from 'react-highcharts'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'

/*** FUNCTIONS ***/
import common from '../controllers/common.jsx'

/*** MAIN ***/
//Turn this into a real component and give it a shouldComponentUpdate(nextProps, nextState),
// and then turn back on Animation
//https://facebook.github.io/react/docs/react-component.html#shouldcomponentupdate
const HighchartsJS = ({ data }) => {
  //Map data into Highcharts series format
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
    series: seriesArr,
    plotOptions: { line: { animation: false } }
  }
  //neverReflow property for ReactHighcharts makes it not render...
  //isPureConfig
  return (
    <div>
      <ReactHighcharts isPureConfig config={config} />
    </div>
  )
}

export default HighchartsJS
