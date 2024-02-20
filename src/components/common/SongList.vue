<template>
  <div class="song-list">
    <li
      class="item"
      v-for="(song, index) in songs"
      :key="song.id"
      @click="selectItem(song, index)"
    >
      <div class="content">
        <h2 class="name" :style="nameStyle(song.id).value">
          {{ song.name }}
        </h2>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
defineProps(['songs'])
const emit = defineEmits(['select'])
const getDesc = (song) => {
  const artists = song.ar.map(artist => artist.name).join('/')
  return `${artists} - ${song.al.name}`
}
const selectItem = (song, index) => {
  emit('select', { song, index })
}
const currentSongId = ref(0)
const store = useStore()
watch(() => store.getters.currentSong.id, (newId) => {
  currentSongId.value = newId
})

const nameStyle = (id) => computed(() => {
  return { color: id === currentSongId.value ? '#ea3e3c' : '#fff' }
})
</script>

<style lang="scss" scoped>
.song-list {
  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;
    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 20px;
      text-align: center;
      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
      }
      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
  }
}
</style>
