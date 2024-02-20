<template>
  <the-scroll class="carechoice-content" v-loading:[loadingText]="loading">
    <div class="carechoice" v-show="!loading">
      <!-- 轮播图 -->
      <div class="slider-wrapper">
        <div class="slider-content">
          <my-banner v-if="banners.length" :banners="banners"></my-banner>
        </div>
      </div>
      <!-- 甄选歌单 -->
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
                  <img width="100" height="100" v-lazy="playlist.coverImgUrl" />
                </div>
                <div class="song-title">
                  {{ playlist.name }}
                </div>
              </div>
            </li>
          </ul>
        </the-scroll>
      </div>
      <!-- 排行榜 -->
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
        <the-scroll>
          <ul class="toplist-list">
            <li
              class="toplist-item"
              v-for="toplist in toplists"
              :key="toplist.id"
            >
              <div class="toplist-item-content">
                <span class="toplist-item-title">{{ toplist.name }}</span>
                <ul class="toplist-list-list">
                  <li
                    class="toplist-list-item"
                    v-for="item in toplist.list"
                    :key="item.id"
                  >
                    <div class="toplist-list-item-content">
                      <img v-lazy="item.al.picUrl" width="80px" height="80px" />
                      <span
                        class="list-item-no"
                        :style="{
                          color: colors[toplist.list.indexOf(item) + 1]
                        }"
                        >{{ toplist.list.indexOf(item) + 1 }}</span
                      >
                      <div class="list-item-text">
                        <div class="songname">{{ item.name }}</div>
                        <div class="authorname">
                          {{ item.ar.map((au) => au.name).join('/') }}
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </the-scroll>
      </div>
      <!-- 数字专辑 -->
      <div class="album">
        <div class="album-wrapper">
          <span class="album-title">数字专辑</span>
          <div class="album-icon">
            <img
              src="..//../assets/svg/arrow_right.svg"
              width="18px"
              height="18px"
            />
          </div>
        </div>
        <the-scroll class="album-content">
          <ul class="album-list">
            <li v-for="album in albums" class="album-item" :key="album.albumId">
              <div class="album-item-content">
                <img width="100" height="100" v-lazy="album.coverUrl" />

                <div class="album-text">
                  <div class="text-albumname">{{ album.albumName }}</div>
                  <div class="text-artistname">{{ album.artistName }}</div>
                  <div class="text-price">￥{{ album.price }}</div>
                </div>
              </div>
            </li>
          </ul>
        </the-scroll>
      </div>
    </div>
  </the-scroll>
</template>

<script setup>

import { defineComponent, onBeforeMount, computed, ref } from 'vue'
import { useStore } from 'vuex'
import MyBanner from '@/components/common/Banner.vue'
import TheScroll from '@/components/common/Scroll.vue'

defineComponent({
  components: { MyBanner, TheScroll }
})

const store = useStore()

const loadingText = ref('正在加载精选列表...')

const banners = ref([])
const selectplaylists = ref([])
const toplists = ref([])
const albums = ref([])

const colors = {
  1: '#c19432',
  2: '#8f90ac',
  3: '#c19432'
}

onBeforeMount(() => {
  store.dispatch('getBanner').then(() => {
    banners.value = store.state.banners
  })

  store.dispatch('getPlaylistHighquality', { limit: 6, before: '0', cat: '日语' }).then(() => {
    selectplaylists.value = store.state.selectplaylists
  })

  store.dispatch('getToplists').then(async () => {
    const result = store.state.toplists.slice(0, 3).map(({ id, name }) => ({ id, name }))
    toplists.value = await Promise.all(result.map(async (item) => {
      const songs = await store.dispatch('getSongListDetail', item.id)
      const list = songs.slice(0, 3)
      return { ...item, list }
    }))
  })

  store.dispatch('getAlbums', { limit: 6, offset: 0 }).then(() => {
    albums.value = store.state.albums
  })
})

const loading = computed(() => {
  return !banners.value.length && !selectplaylists.value.length && !toplists.value.length && !albums.value.length
})

</script>

<style lang="scss" scoped>
.carechoice-content {
  height: 100%;
  overflow: hidden;
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
        display: inline-flex;
        margin-top: 10px;

        .toplist-item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          flex-direction: column;
          background-color: $color-background-b;
          height: 330px;
          width: 350px;
          margin-right: 20px;

          .toplist-item-content {
            height: 100%;
            width: 100%;
            margin-left: 20px;

            .toplist-item-title {
              font-size: $font-size-large;
              margin-right: 5px;
            }
            .toplist-list-list {
              margin-top: 10px;
              display: flex;
              flex-direction: column;

              .toplist-list-item {
                margin: 10px 0;
                .toplist-list-item-content {
                  display: flex;
                  align-items: center;
                  .list-item-no {
                    margin: 0 20px;
                    font-size: $font-size-large-x;
                    font-weight: bold;
                  }
                  .list-item-text {
                    .songname {
                      font-size: $font-size-large;
                    }
                    .authorname {
                      font-size: $font-size-medium-x;
                      color: $color-theme-b;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .album {
      margin: 30px 0 20px 20px;
      box-sizing: border-box;
      height: 400px;
      .album-wrapper {
        display: flex;
        align-items: center;
        .album-title {
          font-size: $font-size-large;
          margin-right: 5px;
        }

        .album-icon {
          display: flex;
          width: 18px;
          height: 18px;
        }
      }

      .album-content {
        width: 100%;
        overflow: hidden;
        .album-list {
          display: inline-flex;
          margin-top: 20px;
          .album-item {
            display: flex;
            box-sizing: border-box;
            align-items: center;
            flex-direction: column;
            padding: 0 20px 20px 0;
            .album-item-content {
              width: 100%;

              .album-text {
                margin-top: 10px;
                width: 100px;
                .text-albumname {
                  font-size: $font-size-large;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                  margin: 10px 0;
                }
                .text-artistname {
                  color: $color-theme-b;
                  font-size: $font-size-medium-x;
                  margin-bottom: 10px;
                }
                .text-price {
                  color: $color-theme-c;
                  font-size: $font-size-medium;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
