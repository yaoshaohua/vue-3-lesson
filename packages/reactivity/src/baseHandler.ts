import { track, trigger } from "./reactiveEffect"

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive'
}

export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }

    const result = Reflect.get(target, key, receiver)

    track(target, key)

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
