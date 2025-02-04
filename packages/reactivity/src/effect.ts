export let activeEffect = null

function cleanDepEffect(dep, effect) {
  dep.delete(effect)
  if (dep.size === 0) {
    dep.cleanup()
  }
}

function preCleanEffect(effect) {
  effect._depLength = 0
  effect._trackId++
}

function postCleanEffect(effect) {
  if (effect.deps.length > effect._depLength) {
    for (let i = effect._depLength; i < effect.deps.length; i++) {
      cleanDepEffect(effect.deps[i], effect)
    }
    effect.deps.length = effect._depLength
  }
}

class ReactiveEffect {
  public _trackId = 0

  public deps = []

  public _depLength = 0

  public active = true

  public running = 0

  constructor(public fn, public scheduler) {

  }
  run() {
    if (!this.active) {
      return this.fn()
    }

    let lastEffect = activeEffect

    try {
      activeEffect = this
      preCleanEffect(this)
      this.running++
      // 依赖收集
      return this.fn()
    } finally {
      this.running--
      postCleanEffect(this)
      activeEffect = lastEffect
    }
  }
}

// effect：对响应式数据收集依赖
// 1. 处理函数会立即执行，如果是响应式数据，则进行收集依赖
// 2. 当响应式数据发生变化，会触发trigger，执行effect的scheduler，即effect.run()
// 3. 如何实现收集依赖
export function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })
  _effect.run()

  if (options) {
    Object.assign(_effect, options)
  }

  return _effect
}

export function trackEffects(effect, dep) {
  if (dep.get(effect) !== effect._trackId) {
    dep.set(effect, effect._trackId)
  }

  let oldDep = effect.deps[effect._depLength]
  if (oldDep !== dep) {
    if (oldDep) {
      cleanDepEffect(oldDep, effect)
    }
    effect.deps[effect._depLength++] = dep
  } else {
    effect._depLength++
  }
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.running === 0 && effect.scheduler) {
      effect.scheduler()
    }
  }
}
