import { AxiosError } from "../../src/types";
import axios from "../../src/index"

axios.get('/customStatus/304').then(res => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)
})

axios.get('/customStatus/304', {
  validateStatus(status) {
    return status >= 200 && status < 400
  }
}).then(res => {
  console.log(res)
}).catch((e: AxiosError) => {
  console.log(e.message)
})
