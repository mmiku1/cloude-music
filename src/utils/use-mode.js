import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from './constant'

const useMode = () => {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  const modeIcon = computed(() => {
    const playModelVal = playMode.value
    return playModelVal === PLAY_MODE.sequence ? 'icon-sequence' : playModelVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
  })

  const modeText = computed(() => {
    const playModelVal = playMode.value
    return playModelVal === PLAY_MODE.sequence ? '顺序播放' : playModelVal === PLAY_MODE.random ? '随机播放' : '单曲循环'
  })

  function changeMode() {
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }

  return { modeIcon, changeMode, modeText }
}

export default useMode
