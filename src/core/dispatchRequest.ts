import { AxiosRequestConfig, AxiosPromise, AxiosResponse, AxiosTransFormer } from '../types'
import { buildUrl, isAbsoulteURL, combineURL } from '../helpers/url'
import { transformRequest, transformResponse } from '../helpers/data'
import { processHeaders, flattenHeaders } from '../helpers/headers'
import transform from './transform'
import xhr from '../xhr'

function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  throwIfCancellationRequested(config)
  processConfig(config)
  return xhr(config).then(
    res => transformResponseData(res),
    e => {
      if (e && e.response) {
        e.response = transformResponseData(e.response)
      }
      return Promise.reject(e)
    }
  )
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformUrl(config)
  // config.headers = transformHeaders(config)
  // config.data = transformRequestData(config)
  mergeDefaultTransform(config)
  if (!config.headers) {
    config.headers = {}
  }
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!)
}

export function transformUrl(config: AxiosRequestConfig): string {
  let { url, params, paramsSerializer, baseUrl } = config
  if (baseUrl && !isAbsoulteURL(url!)) {
    url = combineURL(baseUrl, url!)
  }
  console.log(url, baseUrl)
  return buildUrl(url!, params, paramsSerializer)
}

// function transformRequestData(config: AxiosRequestConfig): any {
//   return transformRequest(config.data)
// }

// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config
//   return processHeaders(headers, data)
// }

function mergeDefaultTransform(config: AxiosRequestConfig): void {
  let { transformRequest: newTransformRequest, transformResponse: newTransformResponse } = config

  let transformRequestFns: AxiosTransFormer[] = [
    function(data: any, headers: any): any {
      processHeaders(headers, data)
      return transformRequest(data)
    }
  ]
  const index = transformRequestFns.length - 1
  if (Array.isArray(newTransformRequest)) {
    Array.prototype.splice.apply(transformRequestFns, [index, 0, ...newTransformRequest])
  } else if (typeof newTransformRequest === 'function') {
    transformRequestFns.splice(index, 0, newTransformRequest)
  }

  let transformResponseFns: AxiosTransFormer[] = [
    function(data: any): any {
      return transformResponse(data)
    }
  ]
  if (Array.isArray(newTransformResponse)) {
    transformResponseFns = transformResponseFns.concat(newTransformResponse)
  } else if (typeof newTransformResponse === 'function') {
    transformResponseFns.push(newTransformResponse)
  }

  config.transformRequest = transformRequestFns
  config.transformResponse = transformResponseFns
}

function transformResponseData(res: AxiosResponse): AxiosResponse {
  // res.data = transformResponse(res.data)
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancellationRequested(config: AxiosRequestConfig): void {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested()
  }
}
export default dispatchRequest
