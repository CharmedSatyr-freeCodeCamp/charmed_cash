/*** PACKAGES ***/
import HTMLWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'

import dotenv from 'dotenv'
dotenv.load()

const PROD = process.env.NODE_ENV === 'production'

/*** COMMON PLUGINS ***/
const defineConfig = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
})

/*** CLIENT CONFIG ***/
const client = {
  entry: ['babel-polyfill', __dirname + '/client/index.jsx'],
  devtool: PROD ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        include: __dirname + '/client',
        exclude: [/node_modules/, /server/],
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react']
        }
      }
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: PROD ? 'js/client.bundle.min.js' : 'js/client.bundle.js'
  },
  plugins: [
    defineConfig,
    new HTMLWebpackPlugin({
      title: 'Charmed Cash',
      template: __dirname + '/client/' + 'index.html',
      filename: __dirname + '/dist/' + 'index.html',
      inject: 'body'
    })
  ]
}

/*** SERVER CONFIG ***/
/*const server = {
  entry: ['babel-polyfill', __dirname + '/server/server.js'],
  devtool: PROD ? false : 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    ]
  },
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  output: {
    path: __dirname + '/server',
    filename: PROD ? 'server.bundle.min.js' : 'server.bundle.js'
  },
  target: 'node',
  externals: [nodeExternals()],
  plugins: PROD ? [defineConfig, compConfig, uglyConfig] : [defineConfig]
}
*/

export default client /* , server*/
