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


axios({
  transformRequest: [(function(data) {
    return qs.stringify(data)
  }), ...(axios.defaults.transformRequest as AxiosTransFormer[])],
  transformResponse: [...(axios.defaults.transformResponse as AxiosTransFormer[]), function(data) {
    if (typeof data === 'object') {
      data.b = 2
    }
    return data
  }],
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  }
}).then((res) => {
  console.log(res.data)
}).catch()

