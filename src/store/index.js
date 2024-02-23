import { createStore } from 'vuex'
import http from '@/utils/http'
import { PLAY_MODE, FAVORITE_KEY } from '@/utils/constant'
import { shuffle } from '@/utils/play-tools'
import { load } from '@/utils/array-store'
export default createStore({
  state: {
    banners: [],
    selectplaylists: [],
    personalsonglists: [],
    toplists: [],
    albums: [],
    singers: [],
    singerdata: [],
    songs: [],

    // 播放相关数据
    sequenceList: [],
    playlist: [],
    playing: false,
    playMode: PLAY_MODE.sequence,
    currentIndex: 0,
    fullScreen: false,
    currentsong: {},
    favoritelist: load(FAVORITE_KEY),
    songLyric: {}
  },
  getters: {
    // 当前歌曲
    currentSong: (state) => {
      return state.playlist[state.currentIndex] || {}
    }
    //
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

    // 精选-数字专辑
    setAlbums(state, albums) {
      state.albums = albums
    },

    // 歌手列表
    setSingers(state, singers) {
      state.singers = singers
    },

    // 歌手详情
    setSingerDetail(state, singerdata) {
      state.singerdata = singerdata
    },

    // 歌手歌曲
    setSingerSongs(state, songs) {
      state.songs = songs
    },

    // 当前歌曲详情
    setSongDetail(state, currentsong) {
      state.currentsong = currentsong
    },

    // 设置播放状态
    setPlayingState(state, playing) {
      state.playing = playing
    },
    // 设置顺序播放列表
    setSequenceList(state, list) {
      state.sequenceList = list
    },

    // 设置播放列表
    setPlayList(state, list) {
      state.playlist = list
    },

    // 设置播放模式
    setPlayMode(state, mode) {
      state.playMode = mode
    },

    // 设置播放索引
    setCurrentIndex(state, index) {
      state.currentIndex = index
    },

    // 设置全屏模式
    setFullScreen(state, fullScreen) {
      state.fullScreen = fullScreen
    },

    // 添加歌词
    addSongLyric(state, { song, lyric }) {
      state.sequenceList.map((item) => {
        if (item.id === song.id) {
          item.lyric = lyric
        }
        return item
      })
    },

    setSongLyric(state, lyric) {
      state.songLyric = lyric
    },

    setFavoriteList(state, list) {
      state.favoritelist = list
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

    // 歌单详情
    async getSongListDetail({ commit }, id) {
      const { songs } = await http.get('/playlist/track/all', { id })
      return songs
    },

    // 精选-数字专辑
    async getAlbums({ commit }, params) {
      const { products } = await http.get('/album/list', params)
      commit('setAlbums', products)
    },

    // 歌手列表
    async getSingers({ commit }, params) {
      const { artists } = await http.get('/artist/list', params)
      commit('setSingers', artists)
    },

    // 歌手详情
    async getSingerDetail({ commit }, id) {
      const { data } = await http.get('/artist/detail', id)
      const { artist } = data
      commit('setSingerDetail', { artist })
    },

    // 歌手歌曲
    async getSingerSongs({ commit }, id) {
      const { songs } = await http.get('/artist/songs', id)
      commit('setSingerSongs', songs)
    },

    // 当前歌曲详情
    async getSongDetail({ commit }, ids) {
      const { songs } = await http.get('/song/detail', ids)
      commit('setSongDetail', songs)
    },

    // 获取歌曲URL
    async getSongURL({ commit }, id) {
      const { data } = await http.get('/song/url', id)
      const { url } = data[0]
      return url
    },

    // 当前歌曲歌词
    async getSongLyric({ commit }, id) {
      const result = await http.get('/lyric', id)
      const lrc = result?.lrc?.lyric
      const tlyric = result?.tlyric?.lyric || ''
      commit('setSongLyric', { lrc, tlyric })
    },

    // 顺序播放
    selectPlay({ commit }, { list, index }) {
      commit('setPlayingState', true)
      commit('setSequenceList', list)
      commit('setPlayList', list)
      commit('setPlayMode', PLAY_MODE.sequence)
      commit('setCurrentIndex', index)
      commit('setFullScreen', true)
    },
    // 随机播放
    randomPlay({ commit }, list) {
      commit('setPlayingState', true)
      commit('setSequenceList', list)
      commit('setPlayList', shuffle(list))
      commit('setPlayMode', PLAY_MODE.random)
      commit('setCurrentIndex', 0)
      commit('setFullScreen', true)
    },

    // 改变播放模式
    changeMode({ commit, state }, mode) {
      if (mode === PLAY_MODE.random) {
        commit('setPlayList', shuffle(state.sequenceList))
      } else {
        commit('setPlayList', state.sequenceList)
      }
      commit('setPlayMode', mode)
    },

    // 从播放列表中删除歌曲
    removeSong({ commit, state }, song) {
      const sequenceList = state.sequenceList.slice()
      const playlist = state.playlist.slice()
      const sequenceIndex = sequenceList.findIndex((item) => {
        return item.id === song.id
      })
      const playIndex = playlist.findIndex((item) => {
        return item.id === song.id
      })

      if (sequenceIndex < 0 || playIndex < 0) {
        return
      }

      sequenceList.splice(sequenceIndex, 1)
      playlist.splice(playIndex, 1)
      let currentIndex = state.currentIndex
      if (playIndex < currentIndex || currentIndex === playlist.length) {
        currentIndex--
      }
      commit('setSequenceList', sequenceList)
      commit('setPlayList', playlist)
      commit('setCurrentIndex', currentIndex)
    },

    // 清空播放列表
    clearSongList({ commit }) {
      commit('setSequenceList', [])
      commit('setPlayList', [])
      commit('setCurrentIndex', [])
      commit('setPlayingState', false)
    }
  },
  modules: {
  }
})
