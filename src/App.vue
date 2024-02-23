<template>
  <my-header></my-header>
  <router-view></router-view>
  <comm-player></comm-player>
  <my-bottom></my-bottom>
</template>

<script setup>
import { defineComponent } from 'vue'
import MyHeader from '@/components/header/Header.vue'
import MyBottom from '@/components/bottom/Bottom.vue'
import CommPlayer from '@/components/player/CommPlayer.vue'

defineComponent({
  MyHeader,
  MyBottom,
  CommPlayer
})

</script>

<style lang="scss">
</style>
