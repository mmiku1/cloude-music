<template>
  <div class="singer-detail">
    <music-list
      :artistName="artistName"
      :briefDesc="briefDesc"
      :alias="alias"
      :avatar="avatar"
      :songs="songs"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script setup>
import { SINGER_KEY } from '@/utils/constant'
import MusicList from '@/components/common/MusicList.vue'
import storage from 'good-storage'
import { computed, defineComponent, defineProps, onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
defineComponent({
  component: { MusicList }
})

const props = defineProps(['singerId'])
const store = useStore()
const artistName = ref(null)
const briefDesc = ref(null)
const alias = ref(null)
const avatar = ref(null)
const songs = ref([])
const loading = ref(true)
const route = useRoute()
const router = useRouter()

onBeforeMount(async () => {
  if (!getSingerId.value) {
    const path = route.matched[0].path
    router.push({ path })
    return
  }
  await store.dispatch('getSingerDetail', { id: getSingerId.value })
  const { artist } = store.state.singerdata
  artistName.value = artist.name
  briefDesc.value = artist.briefDesc
  alias.value = artist.alias.join('/')
  avatar.value = artist.avatar

  await store.dispatch('getSingerSongs', { id: getSingerId.value, order: 'hot', limit: 30 })
  songs.value = store.state.songs
  loading.value = false
})

const getSingerId = computed(() => {
  let res = null
  const singerId = props.singerId
  if (singerId) {
    res = singerId
  } else {
    const cacheSingerId = storage.session.get(SINGER_KEY)
    if (cacheSingerId && String(cacheSingerId) === String(route.params.id)) {
      res = cacheSingerId
    }
  }
  return res
})

</script>

<style lang="scss" scoped>
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
