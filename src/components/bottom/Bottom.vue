Bottom.vue:
<template>
  <div class="bottom" v-show="!fullScreen">
    <router-link
      class="bottom-item"
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
    >
      <div class="bottom-content">
        <img
          :src="$route.path.includes(tab.path) ? tab.activeIcon : tab.icon"
          class="bottom-icon"
        />
        <span class="bottom-link">
          {{ tab.name }}
        </span>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { computed, defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'

defineComponent({
  name: 'MyBottom'
})

const tabs = reactive([
  {
    name: '推荐',
    path: '/recommend',
    icon: require('@/assets/svg/recommend1.svg'),
    activeIcon: require('@/assets/svg/recommend2.svg')
  },
  {
    name: '发现',
    path: '/discover',
    icon: require('@/assets/svg/discover1.svg'),
    activeIcon: require('@/assets/svg/discover2.svg')
  },
  {
    name: '歌手',
    path: '/singer',
    icon: require('@/assets/svg/singer1.svg'),
    activeIcon: require('@/assets/svg/singer2.svg')
  },
  {
    name: '我的',
    path: '/mypage',
    icon: require('@/assets/svg/my1.svg'),
    activeIcon: require('@/assets/svg/my2.svg')
  }
])

const store = useStore()
const fullScreen = computed(() => store.state.fullScreen)

</script>

<style lang="scss" scoped>
.bottom {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  font-size: $font-size-medium;
  background: $color-night-background;
  .bottom-item {
    flex: 1;
    text-align: center;

    .bottom-content {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .bottom-icon {
        width: 1.5em;
        height: 1.5em;
        fill: currentColor;
        overflow: hidden;
      }

      .bottom-link {
        color: $color-text-l;
        line-height: 39px;
      }
    }

    &.router-link-active {
      .bottom-link {
        color: $color-theme-c;
      }
    }
  }
}
</style>
