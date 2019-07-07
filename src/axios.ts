import { AxiosInstence, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import defaults from './defaults'
import { extend } from './helpers/util'

function createInstence(config: AxiosRequestConfig): AxiosInstence {
  const context = new Axios(config)
  const instence = Axios.prototype.request.bind(context)

  extend(instence, context)

  return instence as AxiosInstence
}

const axios = createInstence(defaults)

export default axios
