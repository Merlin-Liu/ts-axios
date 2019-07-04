import { AxiosInstence } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'

function createInstence(): AxiosInstence {
  const context = new Axios()
  const instence = Axios.prototype.request.bind(context)

  extend(instence, context)

  return instence as AxiosInstence
}

const axios = createInstence()

export default axios
