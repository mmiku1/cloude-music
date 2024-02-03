import Bscroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'

import { onMounted, onUnmounted, ref } from 'vue'
Bscroll.use(ObserveDOM)
export default function useScroll(wrapperRef, options) {
  const scroll = ref(null)
  onMounted(() => {
    scroll.value = new Bscroll(wrapperRef.value, {
      observeDOM: true,
      scrollX: true,
      scrollY: true,
      ...options
    })
  })

  onUnmounted(() => {
    scroll.value.destroy()
  })
}
