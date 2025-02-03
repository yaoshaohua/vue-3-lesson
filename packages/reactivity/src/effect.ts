export let activeEffect = null

class ReactiveEffect {
  public _trackId = 0

  public deps = []

  public _depLength = 0

  public active = true

  constructor(public fn, public scheduler) {

  }
  run() {
    if (!this.active) {
      return this.fn()
    }

    let lastEffect = activeEffect

    try {
      // 依赖收集
      activeEffect = this
      return this.fn()
    } finally {
      activeEffect = lastEffect
    }
  }
}

export function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run()
  })
  _effect.run()

  return _effect
}

export function trackEffects(effect, dep) {
  dep.set(effect, effect._trackId)
  effect.deps[effect._depLength++] = dep
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler()
    }
  }
}
