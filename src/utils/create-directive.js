import { createApp } from 'vue'
import { addClass, removeClass } from '@/utils/dom'

const relativeCls = 'g-relative'

const createDirective = (Comp) => {
  const name = Comp.__name
  const append = (el) => {
    const style = getComputedStyle(el)
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }
    el.appendChild(el[name].instance.$el)
  }

  const remove = (el) => {
    const name = Comp.__name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }

  return {
    mounted(el, binding) {
      const app = createApp(Comp)
      const instance = app.mount(document.createElement('div'))
      const name = Comp.__name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value) {
        append(el)
      }
    },
    updated(el, binding) {
      const name = Comp.__name
      const title = binding.arg
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      if (binding.value !== binding.oldValue) {
        binding.value ? append(el) : remove(el)
      }
    }
  }
}

export default createDirective
