<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-show="showTitle">{{ artistName }}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImageRef">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div
          class="play-btn"
          v-show="songs.length > 0"
          @click="randomPlay(songs)"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>

    <the-scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      :probe-type="3"
      @scroll="onScroll"
      v-no-result="noResult"
    >
      <div class="song-list-wrapper">
        <div class="bg-desc" v-show="!showTitle">
          <div class="desc-name">{{ artistName }}</div>
          <div class="desc-text">{{ briefDesc }}</div>
          <div class="desc-alias">{{ alias }}</div>
        </div>
        <song-list :songs="songs" @select="selectItem"> </song-list>
      </div>
    </the-scroll>
  </div>
</template>

<script setup>
import SongList from './SongList.vue'
import { computed, defineComponent, defineProps, onMounted, ref } from 'vue'
import TheScroll from './Scroll.vue'

import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

defineComponent({
  components: {
    SongList,
    TheScroll
  }
})

const props = defineProps(['artistName', 'briefDesc', 'alias', 'avatar', 'songs', 'loading'])

const store = useStore()

const imageHeight = ref(0)
const bgImageRef = ref(null)
const router = useRouter()
const scrollY = ref(0)
const RESERVED_HEIGHT = 40
const maxTranslateY = ref(0)
const showTitle = ref(false)
const songId = computed(() => store.getters.currentSong.id)

onMounted(() => {
  imageHeight.value = bgImageRef.value.clientHeight
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT
})

const bgImageStyle = computed(() => {
  let zIndex = 0
  let paddingTop = '70%'
  let height = 0
  let translateZ = 0
  let scale = 1
  const sly = scrollY.value

  if (sly > maxTranslateY.value) {
    zIndex = 10
    paddingTop = 0
    height = `${RESERVED_HEIGHT}px`
    translateZ = 1
  }

  if (sly < 0) {
    scale = 1 + Math.abs(sly / imageHeight.value)
  }

  return {
    zIndex,
    paddingTop,
    height,
    transform: `scale(${scale}) translateZ(${translateZ})`,
    backgroundImage: `url(${props.avatar})`
  }
})

const scrollStyle = computed(() => {
  return { top: `${imageHeight.value}px` }
})

const filterStyle = computed(() => {
  let blur = 0
  const sly = scrollY.value
  const imh = maxTranslateY.value
  if (sly >= 0) {
    blur = Math.min(maxTranslateY.value / imh, sly / imh) * 5
  }
  return { backdropFilter: `blur(${blur}px)` }
})

const noResult = computed(() => {
  return !props.loading && !props.songs.length
})

const playBtnStyle = computed(() => {
  let display = ''
  if (scrollY.value > maxTranslateY.value) {
    display = 'none'
  }
  return { display: `${display}` }
})

const goBack = () => {
  router.back()
}

const onScroll = (pos) => {
  scrollY.value = -pos.y
  if (scrollY.value > maxTranslateY.value) {
    showTitle.value = true
  } else {
    showTitle.value = false
  }
}

const selectItem = ({ song, index }) => {
  if (song.id !== songId.value) {
    store.dispatch('getSongDetail', { ids: song.id })
  }
  store.dispatch('selectPlay', { list: props.songs, index: index })
}

const randomPlay = (songs) => {
  store.dispatch('randomPlay', { list: songs })
  store.dispatch('getSongDetail', { ids: songId.value })
}

</script>

<style lang="scss" scoped>
.music-list {
  position: relative;
  height: 100%;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 110px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-text;

        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-large;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-medium-x;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .list {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      background: $color-background;
      .bg-desc {
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        position: relative;
        background-color: $color-background-b;
        margin: 10px 10px 0 10px;
        .desc-name {
          font-size: $font-size-large;
          margin: 10px 0;
        }
        .desc-text {
          color: $color-theme-b;
          font-size: $font-size-medium-x;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .desc-alias {
          color: $color-theme-b;
          font-size: $font-size-medium-x;
          margin: 10px 0;
        }
      }
    }
  }
}
</style>
