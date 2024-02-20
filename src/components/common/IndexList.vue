<template>
  <div class="fixed">
    <div v-show="showFixed" class="fixed-list">
      <ul class="singer-area">
        <li
          class="area-item"
          v-for="item in singerArea"
          :key="item.id"
          :style="areaStyle(item.id)"
          @click=";(area = item.id), handleGetSingers()"
        >
          {{ item.area }}
        </li>
      </ul>
      <ul class="singer-type">
        <li
          class="type-item"
          v-for="item in singerType"
          :key="item.id"
          :style="typeStyle(item.id)"
          @click=";(type = item.id), handleGetSingers()"
        >
          {{ item.type }}
        </li>
      </ul>
    </div>
    <div class="fixed-content" v-show="showScreen">
      <div>{{ title }}</div>
      <div class="fixed-avg" @click="handleScreen">
        <img src="../../assets/svg/screen.svg" width="20px" height="20px" />
        <span class="avg-title">筛选</span>
      </div>
    </div>
  </div>
  <the-scroll class="index-list" :probe-type="3" @scroll="onScroll">
    <div class="group">
      <h2 class="title">热门歌手</h2>
      <ul>
        <li
          v-for="item in singers"
          :key="item.id"
          class="item"
          @click="onItemClick(item.id)"
        >
          <img class="avatar" v-lazy="item.picUrl" />
          <span class="name">{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </the-scroll>
</template>

<script setup>
import { defineEmits, computed, ref } from 'vue'
import { useStore } from 'vuex'
import TheScroll from './Scroll.vue'

const emit = defineEmits(['select'])

const singers = computed(() => store.state.singers)

const singerArea = [
  { id: 7, area: '华语' },
  { id: 96, area: '欧美' },
  { id: 8, area: '日本' },
  { id: 16, area: '韩国' },
  { id: 0, area: '其他' }
]

const singerType = [
  { id: 1, type: '男' },
  { id: 2, type: '女' },
  { id: 3, type: '乐队/组合' }
]

const showScreen = ref(false)
const area = ref(-1)
const type = ref(-1)
const store = useStore()

const areaStyle = ref((id) => {
  return { color: area.value === id ? '#ea3e3c' : '#fff' }
})
const typeStyle = ref((id) => {
  return { color: type.value === id ? '#ea3e3c' : '#fff' }
})

const showFixed = computed(() => {
  return !showScreen.value
})

const title = computed(() => {
  if (area.value === -1 && type.value === -1) {
    return '全部歌手'
  } else {
    const areaName = singerArea.find(item => item.id === area.value)?.area
    const typeName = singerType.find(item => item.id === type.value)?.type
    return `${areaName}·${typeName}`
  }
})

const onScroll = (event) => {
  const { y } = event
  if (y < 0) {
    showScreen.value = true
  }
}

const handleScreen = () => {
  showScreen.value = false
}

const handleGetSingers = () => {
  if (area.value === -1) {
    area.value = 7
  }
  if (type.value === -1) {
    type.value = 1
  }
  store.dispatch('getSingers', { type: type.value, area: area.value })
}

const onItemClick = (id) => {
  emit('select', id)
}

</script>

<style lang="scss" scoped>
.fixed {
  margin: 0 0 10px 20px;
  .fixed-list {
    display: flex;
    flex-direction: column;
    .singer-area {
      display: flex;
      flex-direction: row;
      .area-item {
        margin: 10px 40px 10px 0;
      }
    }
    .singer-type {
      display: flex;
      flex-direction: row;
      .type-item {
        margin: 10px 40px 10px 0;
      }
    }
  }
  .fixed-content {
    display: flex;
    justify-content: space-between;
    font-size: $font-size-medium-x;
    .fixed-avg {
      display: flex;
      align-items: center;
      margin-right: 10px;
      .avg-title {
        margin-left: 10px;
      }
    }
  }
}
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      text-align: left;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium-x;
      }
    }
  }
}
</style>
