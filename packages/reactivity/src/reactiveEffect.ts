import { activeEffect, trackEffects, triggerEffects } from "./effect"

const targetMap = new WeakMap()

export function createDep(cleanup) {
  const dep = new Map() as any
  dep.cleanup = cleanup
  return dep
}

export function track(target, key) {
  if (!activeEffect) return

  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }

  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, dep = createDep(() => depsMap.delete(key)))
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
