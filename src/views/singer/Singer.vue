<template>
  <div class="singer" v-loading="!singers.length">
    <index-list @select="selectSinger"></index-list>
    <router-view v-slot="{ Component }">
      <transition name="slide">
        <component :is="Component" :singerId="singerId"> </component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import IndexList from '@/components/common/IndexList.vue'
import { defineComponent, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { SINGER_KEY } from '@/utils/constant'
import storage from 'good-storage'

defineComponent({
  name: 'TheSinger',
  components: { IndexList }
})

const store = useStore()
const router = useRouter()
const singers = ref([])
const singerId = ref(null)

onBeforeMount(() => {
  store.dispatch('getSingers', { type: -1, area: -1 }).then(() => {
    singers.value = store.state.singers
  })
})

const selectSinger = (id) => {
  singerId.value = id
  cacheSinger(id)
  router.push(`singer/${id}`)
}

const cacheSinger = (id) => {
  storage.session.set(SINGER_KEY, id)
}

</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 68px;
  bottom: 160px;
}
</style>
