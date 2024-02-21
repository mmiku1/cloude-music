import Bscroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, ref } from 'vue'

Bscroll.use(ObserveDOM)

const useScroll = (wrapperRef, options, emit) => {
  const scroll = ref(null)
  onMounted(() => {
    const scrollVal = scroll.value = new Bscroll(wrapperRef.value, {
      observeDOM: true,
      scrollX: true,
      scrollY: true,
      ...options
    })
    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        emit('scroll', pos)
      })
    }
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
  return scroll
}

export default useScroll
