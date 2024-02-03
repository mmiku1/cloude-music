import MusicList from '@/components/music-list/MusicList.vue'
import storage from 'good-storage'
import { ref, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const createDetailComponent = (name, Key, fetchName) => {
  return {
    name,
    components: {
      MusicList
    },
    props: {
      data: Object
    },
    setup(props) {
      const songs = ref([])
      const store = useStore()
      const route = useRoute()
      const router = useRouter()
      const loading = ref(true)

      const theKey = computed(() => {
        let ret = null
        if (props.data) {
          ret = props.data
          return ret
        } else {
          const currentKey = storage.session.get(Key)
          if (currentKey && (currentKey.mid || currentKey.id + '') === route.params.id) {
            ret = currentKey
          }
          return ret
        }
      })

      onBeforeMount(async () => {
        if (!theKey.value) {
          const path = route.matched[0].path
          router.push({ path })
          return
        }
        await store.dispatch(fetchName, theKey.value)
        const result = await store.dispatch('getSongs', store.state.songs)
        songs.value = result
        loading.value = false
      })

      const pic = computed(() => {
        const data = theKey.value
        return data && data.pic
      })

      const title = computed(() => {
        const data = theKey.value
        return data && (data.name || data.title)
      })

      return {
        songs,
        loading,
        pic,
        title
      }
    }
  }
}

export default createDetailComponent
