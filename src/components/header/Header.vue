<template>
  <div class="header">
    <span class="icon"> </span>
    <h1 class="text">网易云音乐</h1>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'

defineComponent({
  name: 'myHeader'
})
</script>

<style lang="scss" scoped>
.header {
  height: 44px;
  text-align: center;
  color: $color-theme;
  font-size: 0;
  .icon {
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    @include bg-image('logo');
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
}
</style>
