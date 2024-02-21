<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, defineEmits, ref, defineExpose } from 'vue'
import useScroll from '@/utils/use-scroll'

defineComponent({
  name: 'TheScroll'
})

const props = defineProps({
  click: {
    type: Boolean,
    default: true
  },
  probeType: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['scroll'])

const rootRef = ref(null)
const scroll = useScroll(rootRef, props, emit)

defineExpose({
  scroll
})
</script>
