<template>
  <div class="progress-bar" @click="onClick" ref="barRef">
    <div class="bar-inner">
      <div class="progress" :style="progressStyle" ref="progressRef"></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, watch, computed, reactive } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['progress-changing', 'progress-changed'])

const progressBtnWidth = 16
const offset = ref(0)
const touch = reactive({})
const progressRef = ref(null)
const barRef = ref(null)

const barWidth = computed(() => barRef.value.clientWidth - progressBtnWidth)

const progressStyle = computed(() => {
  return `width:${offset.value}px`
})
const btnStyle = computed(() => {
  return `transform:translate3D(${offset.value}px,0,0)`
})

watch(() => props.progress, (newProgress) => {
  offset.value = barWidth.value * newProgress
})

const onTouchStart = (e) => {
  touch.x1 = e.touches[0].pageX
  touch.beginWidth = progressRef.value.clientWidth
}
const onTouchMove = (e) => {
  const delta = e.touches[0].pageX - touch.x1
  const tempWidth = touch.beginWidth + delta
  const progress = Math.min(1, Math.max(tempWidth / barWidth.value, 0))
  offset.value = barWidth.value * progress
  emit('progress-changing', progress)
}
const onTouchEnd = () => {
  const progress = progressRef.value.clientWidth / barWidth.value
  emit('progress-changed', progress)
}

const onClick = (e) => {
  const rect = barRef.value.getBoundingClientRect()
  const offsetWidth = e.pageX - rect.left
  const progress = offsetWidth / barWidth.value
  offset.value = barWidth.value * progress
  emit('progress-changed', progress)
}

</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme-b;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme-a;
      }
    }
  }
}
</style>
