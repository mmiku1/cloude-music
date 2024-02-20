import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/utils/array-store'
import { FAVORITE_KEY } from '@/utils/constant'

const useFavorite = () => {
  const store = useStore()
  const favoritelist = computed(() => store.state.favoritelist)
  const maxLen = 50

  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite(song) {
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
    function compare(item) {
      return item.id === song.id
    }
  }

  function isFavorite(song) {
    return favoritelist.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }
  return { getFavoriteIcon, toggleFavorite }
}

export default useFavorite
