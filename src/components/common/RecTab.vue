<template>
  <div class="tab">
    <router-link
      :to="tab.path"
      class="tab-item"
      v-for="tab in tabs"
      :key="tab.path"
    >
      <div class="tab-link">
        {{ tab.name }}
      </div>
    </router-link>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  setup() {
    const tabs = reactive([
      {
        name: '精选',
        path: '/discover/carechoice'
      }, {
        name: '排行榜',
        path: '/discover/toplist'
      },
      {
        name: '歌单',
        path: '/discover/songlist'
      },
      {
        name: '助眠',
        path: '/discover/helpsleep'
      }
    ]
    )
    return {
      tabs
    }
  }
})
</script>

<style lang="scss" scoped>
.tab {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  margin-bottom: 30px;

  .tab-item {
    flex: 1;
    text-align: center;

    .tab-link {
      padding-bottom: 5px;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab-link {
        color: $color-text;
      }
      background-color: $color-background-c;
      border-radius: 15px;
    }
  }
}
</style>
