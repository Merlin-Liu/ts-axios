// const Koa = require('koa')
// const bodyParser = require('koa-bodyparser')
// const json = require('koa-json')
// const webpack = require('webpack')
// const webpackDevMiddleware = require('webpack-dev-middleware')
// const webpackHotMiddleware = require('webpack-hot-middleware')
// const WebpackConfig = require('./webpack.config')

// const app = new Koa()
// app.use(bodyParser({
//   extendTypes: ['json', 'form', 'text']
// }))
// app.use(json())

// const compiler = webpack(WebpackConfig)
// app.use(webpackDevMiddleware(compiler, {
//   publicPath: '/__build__/',
//   stats: {
//     colors: true,
//     chunks: false
//   }
// }))
// app.use(webpackHotMiddleware(compiler))
// app.use(Koa.static(__dirname))

// const port = process.env.PORT || 8080
// module.exports = app.listen(port, () => {
//   console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
// })


const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')
const router = express.Router()

const app = express()
const compiler = webpack(WebpackConfig)

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

router.get('/simple/get', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

app.use(router)

const port = process.env.PORT || 8080
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
