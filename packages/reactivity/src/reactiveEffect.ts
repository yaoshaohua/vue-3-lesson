import { activeEffect, trackEffects, triggerEffects } from "./effect"

const targetMap = new WeakMap()

export function createDep(cleanup, key) {
  const dep = new Map() as any
  dep.cleanup = cleanup
  dep.name = key
  return dep
}

// targetMap example:
// WeakMap {Object => Map(2)}
// { 
//  key: { name: 'lihua', age: 18 }
//  value: Map(2) {
//   key: 'name',
//   value: Map(1) {
//     key: effect
//     value: effect._trackId
//   }
//  }
// }

export function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = createDep(() => depsMap.delete(key), key))
  }

  trackEffects(activeEffect, dep)
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  let dep = depsMap.get(key)
  if (!dep) return

  triggerEffects(dep)
}
