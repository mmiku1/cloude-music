<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div class="slider-page" v-for="item in banners" :key="item.bannerId">
        <a :href="item.url">
          <img :src="item.pic" />
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in banners"
        :key="item.bannerId"
        :class="{ active: currentPageIndex === index }"
      >
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, defineProps, ref } from 'vue'
import useSlider from '@/utils/use-slider'

defineComponent({
  name: 'MyBanner'
})

defineProps({
  banners: {
    type: Array,
    default: () => []
  }
})

const rootRef = ref(null)
const { currentPageIndex } = useSlider(rootRef)

</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;
  .slider-group {
    overflow: hidden;
    white-space: nowrap;
    .slider-page {
      display: inline-block;
      transform: translate3d(0, 0, 0);
      backface-visibility: hidden;
      a {
        display: block;
        width: 100%;
      }
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .dots-wrapper {
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $color-text-l;
      &.active {
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }
}
</style>
