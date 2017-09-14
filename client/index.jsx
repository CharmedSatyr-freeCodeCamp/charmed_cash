import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import sass from './styles/styles.scss'
import App from './components/App.jsx'
import './img/favicon.ico'

ReactDOM.render(<App />, document.getElementById('app'))
