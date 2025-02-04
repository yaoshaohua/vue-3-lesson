import { toReactive } from "./reactive"
import { activeEffect, trackEffects, triggerEffects } from "./effect"
import { createDep } from "./reactiveEffect"

function trackRefValue(ref) {
  if (activeEffect) {
    trackEffects(activeEffect, ref.dep || (ref.dep = createDep(() => ref.dep = null, 'value')))
  }
}

function triggerRefValue(ref) {
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}

class RefImpl {
  public __v_isRef = true

  public _value

  public dep

  constructor(public rawValue) {
    this._value = toReactive(rawValue)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this._value = newValue
      this.rawValue = newValue
      triggerRefValue(this)
    }
  }
}

function createRef(value) {
  const ref = new RefImpl(value)
  return ref
}

export function ref(value) {
  return createRef(value)
}
