<template>
  <div class="loading">
    <div class="loading-content">
      <img
        width="24"
        height="24"
        src="../../assets/images/loading.gif"
        alt=""
      />
      <p class="desc">{{ title }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, defineExpose, ref } from 'vue'

defineComponent({
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Loading'
})

const title = ref('正在加载...')
const setTitle = (newTitle) => {
  title.value = newTitle
}
defineExpose({ setTitle })

</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  .loading-content {
    text-align: center;
    .desc {
      line-height: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
    }
  }
}
</style>
