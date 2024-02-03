import storage from 'good-storage'

const insetArray = (arr, val, compare, maxLen) => {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

const deleteFromArray = (arr, compare) => {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

const save = (item, key, compare, maxLen) => {
  const items = storage.get(key, [])
  insetArray(items, item, compare, maxLen)
  storage.set(key, items)
  return items
}

const remove = (key, compare) => {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

const load = (key) => {
  return storage.get(key, [])
}

const saveAll = (items, key) => {
  storage.set(key, items)
}

export { save, remove, load, saveAll }
