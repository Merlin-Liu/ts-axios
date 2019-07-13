import qs from 'qs'
import axios from "../../src/index"

axios.get('/customParamSerializer/get', {
  params: new URLSearchParams('a=b&c=d')
}).then(res => {
  console.log(res)
}).catch()

axios.get('/customParamSerializer/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(res => {
  console.log(res)
}).catch()

const instance = axios.create({
  paramsSerializer(params) {
    // return qs.stringify(params, { arrayFormat: 'brackets' })
    // return qs.stringify(params)
    return 'a=1'
  }
})

instance.get('/customParamSerializer/get', {
  params: {
    a: 1,
    b: 2,
    c: ['a', 'b', 'c']
  }
}).then(res => {
  console.log(res)
}).catch()
