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


const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const multipart = require('connect-multiparty')
const atob = require('atob')
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
app.use(express.static(__dirname, {
  setHeaders (res) {
    res.cookie('XSRF-TOKEN-D', '1234abc')
  }
}))
app.use(express.static(__dirname))
app.use(multipart({
  uploadDir: path.resolve(__dirname, 'upload-file')
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

router.get('/simple/get', function (req, res) {
  res.json({
    msg: `hello world`
  })
})

router.get('/base/get', function (req, res) {
  res.json(req.query)
})
router.post('/base/post', function (req, res) {
  res.json(req.body)
})
router.post('/base/buffer', function (req, res) {
  let data = {}
  req.on('data', (chunk) => {
    if (chunk) {
      console.log(chunk.toString())
      data = chunk
    }
  })
  req.on('end', () => {
    res.json(data.toString())
  })
})

router.get('/error/get', function (req, res) {
  if (Math.random() > 0.5) {
    res.json({
      msg: `hello world`
    })
  } else {
    res.status(500)
    res.end()
  }
})

router.get('/error/timeout', function (req, res) {w
  setTimeout(() => {
    res.json({
      msg: `hello world`
    })
  }, 3000)
})


// extend
router.post('/extend/post', function (req, res) {
  res.json(req.body)
})
router.get('/extend/user', function (req, res) {
  res.json({
    result: {
      name: 'liu',
      age: 12,
    }
  })
})

// interceptor
router.get('/interceptor/get', function (req, res) {
  res.json('data-')
})

// config
router.post('/config/post', function(req, res) {
  res.json({
    a: 1
  })
})

// cancel
router.get('/cancel/get', function (req, res) {
  res.json('data-')
})
router.post('/cancel/post', function (req, res) {
  res.json('data-')
})

// more
router.get('/more/get', function (req, res) {
  res.json(req.cookies)
})

// xstf
router.get('/xsrf/get', function (req, res) {
  const token = req.get("X-XSRF-TOKEN-D")
  res.json({token})
})

// progress
router.post('/more/upload', function(req, res) {
  console.log(req.files)
  res.json({data: req.files})
})

// auth
router.post('/auth/post', function(req, res) {
  const auth = req.headers.authorization
  const [type, credentials] = auth.split(' ')
  console.log(atob(credentials))
  const [username, password] = atob(credentials).split(':')
  if (type === 'Basic' && username === 'Yee' && password === '123456') {
    res.json(req.body)
  } else {
    res.end('UnAuthorization')
  }
})

// custom validate status
router.get('/customStatus/304', function(req, res) {
  res.status(304)
  res.end()
})

app.use(router)

const port = process.env.PORT || 8081
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})
