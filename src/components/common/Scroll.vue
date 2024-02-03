<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, ref } from 'vue'
import useScroll from '@/utils/use-scroll'

defineComponent({
  name: 'TheScroll'
})

const props = defineProps({
  click: {
    type: Boolean,
    default: true
  }
})

const rootRef = ref(null)
useScroll(rootRef, props.click)

</script>
