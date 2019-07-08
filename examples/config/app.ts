import qs from "qs";
import { AxiosTransFormer } from "../../src/types"
import axios from '../../src/index'

// axios.defaults.headers.common['test2'] = 123

// axios({
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   },
//   headers: {
//     test: '321'
//   }
// }).then((res) => {
//   console.log(res.data)
// }).catch()


// axios({
//   transformRequest: [(function(data) {
//     return qs.stringify(data)
//   })],
//   transformResponse: [function(data) {
//     if (typeof data === 'object') {
//       data.b = 2
//     }
//     return data
//   }],
//   url: '/config/post',
//   method: 'post',
//   data: {
//     a: 1
//   }
// }).then((res) => {
//   console.log(res.data)
// }).catch()

const instance = axios.create({
  transformRequest: function(data) {
    console.log(1111)
    return qs.stringify(data)
  },
  transformResponse: [ function(data) {
    console.log(2222)
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }]
})

instance({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
}).catch()
