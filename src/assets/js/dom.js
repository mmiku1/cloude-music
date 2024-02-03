const addClass = (el, className) => {
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

const removeClass = (el, className) => {
  el.classList.remove(className)
}

export { addClass, removeClass }
