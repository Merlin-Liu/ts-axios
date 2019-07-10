import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from './types'
import { parseHeaders } from './helpers/headers'
import { isURLSameOrigin } from './helpers/url'
import { isFormData } from './helpers/util'
import cookie from './helpers/cookie'
import { createError } from './helpers/error'

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method = 'GET',
      headers,
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownLoadProgress,
      onUploadProgress
    } = config
    const request = new XMLHttpRequest()

    request.open(method.toUpperCase(), url!, true)

    // xhr对象配置
    configureRequest()
    // xhr对象添加事件处理
    addEvent()
    // xhr对象header配置
    processHeader()
    // xhr对象取消配置
    processCancel()

    request.send(data)

    function configureRequest(): void {
      responseType && (request.responseType = responseType)
      timeout && (request.timeout = timeout)
      withCredentials && (request.withCredentials = true)
    }

    function addEvent(): void {
      request.onreadystatechange = function handleLoad() {
        if (request.readyState !== 4 || request.status === 0) return

        const responseData =
          responseType && responseType !== 'text' ? request.response : request.responseText
        const response: AxiosResponse = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: parseHeaders(request.getAllResponseHeaders()),
          config,
          request
        }
        handleResponse(response)
      }

      request.onerror = function handleError() {
        reject(createError('Network Error', config, null, request))
      }

      request.ontimeout = function handleTimeout() {
        reject(
          createError(`Timeout of ${config.timeout} ms exceeded`, config, 'ECONNABORTED', request)
        )
      }

      onDownLoadProgress && (request.onprogress = onDownLoadProgress)
      onUploadProgress && (request.upload.onprogress = onUploadProgress)
    }

    function processHeader(): void {
      isFormData(data) && delete headers['Content-Type']

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName)
        xsrfValue && (headers[xsrfHeaderName!] = xsrfValue)
      }

      Object.keys(headers).forEach(name => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      cancelToken &&
        cancelToken.promise
          .then(reason => {
            request.abort()
            reject(reason)
          })
          .catch()
    }

    function handleResponse(response: AxiosResponse) {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}
