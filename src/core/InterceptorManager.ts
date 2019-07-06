import { ResolvedFn, RejectedFn, AxiosInterceptorManager } from '../types'

interface Interceptor<T> {
  resolved: ResolvedFn<T>

  rejected?: RejectedFn
}

export default class InterceptorManager<T> implements AxiosInterceptorManager<T> {
  private interceptors: Array<Interceptor<T> | null>

  constructor() {
    this.interceptors = []
  }

  use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
    this.interceptors.push({ resolved, rejected })
    return this.interceptors.length - 1
  }

  forEach(fn: (interceptor: Interceptor<T>) => void): void {
    this.interceptors.forEach(interceptor => {
      interceptor !== null && fn(interceptor)
    })
  }

  eject(id: number): void {
    if (this.interceptors[id] !== null) {
      this.interceptors[id] = null
    }
  }
}
