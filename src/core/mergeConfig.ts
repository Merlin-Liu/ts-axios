import { AxiosRequestConfig } from '../types'
import { isPlainObject, deepMerge } from '../helpers/util'

const starts = Object.create(null)

function defaultStart(val1: any, val2: any): any {
  return typeof val2 !== 'undefined' ? val2 : val1
}

function fromVal2Start(val1: any, val2: any): any {
  if (typeof val2 !== 'undefined') {
    return val2
  }
}
;['url', 'data', 'params'].forEach(key => {
  starts[key] = fromVal2Start
})

function deepMergeStart(oldVal: any, newVal: any): any {
  if (isPlainObject(newVal)) {
    return deepMerge(oldVal, newVal)
  } else if (typeof newVal !== 'undefined') {
    return newVal
  } else if (isPlainObject(oldVal)) {
    return deepMerge(oldVal)
  } else if (typeof oldVal !== 'undefined') {
    return oldVal
  }
}
;['header'].forEach(key => {
  starts[key] = deepMergeStart
})

export default function mergeConfig(
  config1: AxiosRequestConfig,
  config2?: AxiosRequestConfig
): AxiosRequestConfig {
  if (!config2) {
    config2 = {}
  }

  const config = Object.create(null)

  for (let key in config2) {
    mergeField(key)
  }

  for (let key in config1) {
    if (!config2[key]) {
      mergeField(key)
    }
  }

  function mergeField(key: string): void {
    const start = starts[key] || defaultStart
    config[key] = start(config1[key], config2![key])
  }

  return config
}
