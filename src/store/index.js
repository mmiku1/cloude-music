import { createStore } from 'vuex'
import http from '@/utils/http'
export default createStore({
  state: {
    banners: [],
    selectplaylists: [],
    personalsonglists: [],
    toplists: []
  },
  getters: {
  },
  mutations: {
    // 精选-轮播图
    setBanner(state, banners) {
      state.banners = banners
    },

    // 精选-甄选歌单
    setPlaylistHighquality(state, selectplaylists) {
      state.selectplaylists = selectplaylists
    },

    // 精选-排行榜

    setToplists(state, toplists) {
      state.toplists = toplists
    },

    setPersonalized(state, personalsonglists) {
      state.personalsonglists = personalsonglists
    }

  },
  actions: {
    // 精选-轮播图
    async getBanner({ commit }) {
      const { banners } = await http.get('/banner', { type: 1 })
      const formattedBanners = banners.map(banner => {
        const { pic, url, targetId, targetType, typeTitle, bannerId } = banner
        return { pic, url, targetId, targetType, typeTitle, bannerId }
      })
      commit('setBanner', formattedBanners)
    },

    // 精选-推荐歌单
    async getPlaylistHighquality({ commit }, params) {
      const { playlists } = await http.get('/top/playlist/highquality', params)
      const selectplaylists = playlists.map(playlist => {
        const { coverImgUrl, description, id, name, playCount } = playlist
        return { coverImgUrl, description, id, name, playCount }
      })
      commit('setPlaylistHighquality', selectplaylists)
    },

    // 精选-排行榜

    async getToplists({ commit }) {
      const { list } = await http.get('/toplist/detail')
      commit('setToplists', list)
    },

    async getPersonalized({ commit }, params) {
      const { result } = await http.get('/personalized', params)
      commit('setPersonalized', result)
    }

  },
  modules: {
  }
})
