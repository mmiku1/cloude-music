<template>
  <my-header></my-header>
  <router-view></router-view>
  <my-bottom></my-bottom>
</template>

<script setup>
import { defineComponent } from 'vue'
import MyHeader from '@/components/header/Header.vue'
import MyBottom from '@/components/bottom/Bottom.vue'
defineComponent({
  MyHeader,
  MyBottom
})

</script>

<style lang="scss">
</style>
