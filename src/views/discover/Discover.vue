<template>
  <div class="discover">
    <rec-tab></rec-tab>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue'
import RecTab from '@/components/common/RecTab.vue'

defineComponent({
  name: 'MyDiscover',
  components: { RecTab }
})

</script>

<style lang="scss" scoped>
.discover {
  position: fixed;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>
