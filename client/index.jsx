import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import sass from './styles/styles.scss'
import App from './components/App.jsx'

ReactDOM.render(<App />, document.getElementById('app'))
