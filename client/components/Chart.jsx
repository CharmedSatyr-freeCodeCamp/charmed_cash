'use strict'

/*** PACKAGES ***/
import React, { Component } from 'react'
import ReactHighcharts from 'react-highcharts'
import ReactHighstock from 'react-highcharts/ReactHighstock.src'

/*** FUNCTIONS ***/
import common from '../controllers/common.jsx'

/*** MAIN ***/
export default class HighchartsJS extends Component {
  constructor(props) {
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.data === nextProps.data) {
      return false
    } else {
      return true
    }
  }
  render() {
    //Map data into Highcharts series format
    const seriesArr = this.props.data.map(item => {
      return {
        name: common.prettyTickers(item[0]),
        data: common.uniq(item[1].sort()), //Sort by data and deduplicate
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
      legend: {
        layout: 'horizontal',
        shadow: 'true',
        backgroundColor: '#ffffff',
        itemStyle: {
          color: '#000000',
          'font-weight': 'lighter'
        }
      },
      xAxis: {
        type: 'datetime',
        labels: { style: { color: '#000000', 'font-family': 'sans' } }
      },
      yAxis: {
        title: { style: { color: '#000000', 'font-family': 'sans' } }
      },
      rangeSelector: {
        selected: 1
      },
      title: {
        style: { color: '#000000', 'font-family': 'sans' },
        text: 'Digital Currency Prices'
      },
      series: seriesArr,
      plotOptions: { line: { animation: true } }
    }

    // isPureConfig should keep the chart from updating unless it has new data
    return (
      <div>
        <ReactHighcharts isPureConfig config={config} />
      </div>
    )
  }
}
