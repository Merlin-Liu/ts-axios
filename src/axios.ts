import { AxiosInstence, AxiosStatic, AxiosRequestConfig } from './types'
import Axios from './core/Axios'
import defaults from './defaults'
import mergeConfig from './core/mergeConfig'
import { extend } from './helpers/util'

function createInstence(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  const instence = Axios.prototype.request.bind(context)

  extend(instence, context)

  return instence as AxiosStatic
}

const axios = createInstence(defaults)

axios.create = function create(config) {
  return createInstence(mergeConfig(defaults, config))
}

export default axios
