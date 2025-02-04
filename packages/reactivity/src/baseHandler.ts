import { isObject } from "@chibivue/shared"
import { track, trigger } from "./reactiveEffect"
import { reactive } from "./reactive"

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    track(target, key)

    const result = Reflect.get(target, key, receiver)
    if (isObject(result)) {
      return reactive(result)
    }
    return result
  },
  set(target, key, value, receiver) {
    const oldValue = target[key]

    const result = Reflect.set(target, key, value, receiver)

    if (oldValue !== value) {
      trigger(target, key)
    }

    return result
  }
}
