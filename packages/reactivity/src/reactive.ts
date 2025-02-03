import { isObject } from "@chibivue/shared"
import { ReactiveFlags, mutableHandlers } from './baseHandler'

const reactiveMap = new WeakMap()

function createReactiveObject(target) {
  if (!isObject(target)) {
    return target
  }

  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  const existingProxy = reactiveMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  
  return proxy
}

export function reactive(target) {
  return createReactiveObject(target)
}
