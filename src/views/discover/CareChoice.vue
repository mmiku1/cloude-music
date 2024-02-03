<template>
  <the-scroll class="carechoice-content">
    <div class="carechoice">
      <div class="slider-wrapper">
        <div class="slider-content">
          <my-banner v-if="banners.length" :banners="banners"></my-banner>
        </div>
      </div>
      <div class="song-list-content">
        <span class="song-list-title">甄选歌单</span>
        <the-scroll class="list-content">
          <ul class="song-list">
            <li
              v-for="playlist in selectplaylists"
              class="song-item"
              :key="playlist.id"
            >
              <div class="song-item-content">
                <div class="song-icon">
                  <img
                    src="../../assets/svg/Headset.svg"
                    class="song-svg-icon"
                  />
                  <span class="song-badge">
                    {{ (playlist.playCount / 10000).toFixed(1) }}万
                  </span>
                  <img width="100" height="100" :src="playlist.coverImgUrl" />
                </div>
                <div class="song-title">
                  {{ playlist.name }}
                </div>
              </div>
            </li>
          </ul>
        </the-scroll>
      </div>
      <div class="toplist-content">
        <div class="title-icon-wrapper">
          <span class="toplist-title">排行榜</span>
          <div class="toplist-icon">
            <img
              src="..//../assets/svg/arrow_right.svg"
              width="18px"
              height="18px"
            />
          </div>
        </div>
        <div>
          <ul class="toplist-list">
            <li class="toplist-item">
              <div class="toplist-item-content"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </the-scroll>
</template>

<script setup>

import { defineComponent, onBeforeMount, ref } from 'vue'
import { useStore } from 'vuex'
import MyBanner from '@/components/common/Banner.vue'
import TheScroll from '@/components/common/Scroll.vue'

defineComponent({

  components: { MyBanner, TheScroll }
})

const store = useStore()

const banners = ref([])
const selectplaylists = ref([])
const toplists = ref([])

onBeforeMount(() => {
  store.dispatch('getBanner').then(() => {
    banners.value = store.state.banners
  })

  store.dispatch('getPlaylistHighquality', { limit: 6, before: '0', cat: '日语' }).then(() => {
    selectplaylists.value = store.state.selectplaylists
  })

  store.dispatch('getToplists').then(() => {
    toplists.value = store.state.toplists.slice(0, 6)
    console.log(toplists.value)
  })
})

</script>

<style lang="scss" scoped>
.carechoice-content {
  height: 100%;
  .carechoice {
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .song-list-content {
      margin: 30px 0 20px 20px;
      box-sizing: border-box;
      .song-list-title {
        font-size: $font-size-large;
      }
      .list-content {
        width: 100%;
        overflow: hidden;

        .song-list {
          display: inline-flex;
          margin-top: 20px;
        }
        .song-item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          flex-direction: column;
          padding: 0 20px 20px 0;
          .song-item-content {
            width: 100%;
            .song-icon {
              position: relative;
              flex: 0 0 100px;
              height: 100px;
              width: 100px;

              .song-svg-icon {
                position: absolute;
                top: 10px;
                left: 10px;
                z-index: 1;
                width: 12px;
                height: 12px;
              }

              .song-badge {
                position: absolute;
                top: 11px;
                left: 30px;
                color: $color-text;
                font-size: $font-size-small;
              }
            }
            .song-title {
              margin-top: 10px;
              width: 100px;
              text-align: center;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .toplist-content {
      display: flex;
      flex-direction: column;
      margin: 30px 0 20px 20px;
      box-sizing: border-box;

      .title-icon-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 10px;

        .toplist-title {
          font-size: $font-size-large;
          margin-right: 5px;
        }

        .toplist-icon {
          display: flex;
          width: 18px;
          height: 18px;
        }
      }

      .toplist-list {
        background-color: #fff;
        height: 500px;
        width: 350px;

        .toplist-item {
          .toplist-item-content {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
