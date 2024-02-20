<template>
  <div class="player">
    <div class="normal-player" v-show="fullScreen">
      <template v-if="currentsong">
        <div class="background">
          <img :src="currentsong.al.picUrl" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{ currentsong.name }}</h1>
          <h2 class="subtitle">{{ currentsong.ar.name }}</h2>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <progress-bar
                :progress="progress"
                @progress-changing="onProgressChangeing"
                @progress-changed="onProgressChanged"
              >
              </progress-bar>
            </div>
            <span class="time time-r">{{
              formatTime(currentsong.dt / 1000)
            }}</span>
          </div>
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                :class="getFavoriteIcon(currentsong)"
                @click="toggleFavorite(currentsong)"
              ></i>
            </div>
          </div>
        </div>
      </template>
    </div>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script setup>
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import useMode from '@/utils/use-mode'
import useFavorite from '@/utils/use-favorite'
import ProgressBar from './ProgressBar.vue'
import { formatTime } from '@/utils/play-tools'
import { PLAY_MODE } from '@/utils/constant'

defineComponent({
  ProgressBar
})

const store = useStore()
const audioRef = ref(null)
const songReady = ref(false)
const currentTime = ref(0)

const fullScreen = computed(() => store.state.fullScreen)
const currentsong = computed(() => store.state.currentsong[0])
const playing = computed(() => store.state.playing)
const currentIndex = computed(() => store.state.currentIndex)
const playlist = computed(() => store.state.playlist)
const playMode = computed(() => store.state.playMode)
const songId = computed(() => store.getters.currentSong.id)

const playIcon = computed(() => {
  return playing.value ? 'icon-pause' : 'icon-play'
})
const disableCls = computed(() => {
  return songReady.value ? '' : 'disable'
})
const progress = computed(() => {
  return currentTime.value / currentsong.value.dt
})

const { modeIcon, changeMode } = useMode()
const { getFavoriteIcon, toggleFavorite } = useFavorite()

watch(currentsong, (newsong) => {
  if (!newsong.id) {
    return
  }
  currentTime.value = 0
  songReady.value = false
  const audioEl = audioRef.value
  audioEl.pause()
  audioEl.currentTime = 0
  audioEl.src = `https://music.163.com/song/media/outer/url?id=${newsong.id}.mp3`
  audioEl.load()
  audioEl.addEventListener('loadeddata', () => {
    audioEl.play()
  })
})

watch(playing, (newPlaying) => {
  if (!songReady.value) {
    return
  }
  const audioEl = audioRef.value
  newPlaying ? audioEl.play() : audioEl.pause()
})

const goBack = () => {
  store.commit('setFullScreen', false)
}

const togglePlay = () => {
  if (!songReady.value) {
    return
  }
  store.commit('setPlayingState', !playing.value)
}

const pause = () => {
  store.commit('setPlayingState', false)
}

const prev = () => {
  const listLength = playlist.value.length
  if (!songReady.value || !listLength) {
    return
  }
  if (listLength === 1) {
    loop()
  } else {
    let index = currentIndex.value - 1
    if (index === -1) {
      index = listLength - 1
    }
    store.commit('setCurrentIndex', index)
    store.dispatch('getSongDetail', { ids: songId.value })
    if (!playing.value) {
      store.commit('setPlayingState', true)
    }
  }
}

const next = () => {
  const listLength = playlist.value.length
  if (!songReady.value || !listLength) {
    return
  }
  if (listLength === 1) {
    loop()
  } else {
    let index = currentIndex.value + 1
    if (index === listLength) {
      index = 0
    }
    store.commit('setCurrentIndex', index)
    store.dispatch('getSongDetail', { ids: songId.value })
    if (!playing.value) {
      store.commit('setPlayingState', true)
    }
  }
}

const loop = () => {
  const audioEl = audioRef.value
  audioEl.currentTime = 0
  audioEl.play()
  store.commit('setPlayingState', true)
}

const ready = () => {
  if (songReady.value) {
    return
  }
  songReady.value = true
}
const error = () => {
  songReady.value = true
}

const end = () => {
  currentTime.value = 0
  if (playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    next()
  }
}

const updateTime = (e) => {
  currentTime.value = e.target.currentTime
}

const onProgressChangeing = (progress) => {
  currentTime.value = (currentsong.value.dt / 1000) * progress
}

const onProgressChanged = (progress) => {
  audioRef.value.currentTime = currentTime.value = (currentsong.value.dt / 1000) * progress
  if (!playing.value) {
    store.commit('setPlayingState', true)
  }
}

</script>

<style lang="scss" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        width: 100%;
        height: 100%;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
            }
            .playing {
              animation: rotate 20s linear infinite;
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;

          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }
}
</style>