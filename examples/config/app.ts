import axios from '../../src/index'

axios.defaults.headers.common['test2'] = 123

axios({
  url: '/config/post',
  method: 'post',
  data: {
    a: 1
  },
  headers: {
    test: '321'
  }
}).then((res) => {
  console.log(res.data)
}).catch()
