import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import Lyric from 'lyric-parser'

const useLyric = ({ songReady, currentTime }) => {
  const lyricScrollRef = ref(null)
  const lyricListRef = ref(null)
  const currentLyric = ref(null)
  const playingLyric = ref('')
  const nextLyric = ref('')
  const currentLineNum = ref(0)
  const nextLineNum = ref(0)
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)

  watch(currentSong, async (newSong) => {
    if (!newSong.id) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    await store.dispatch('getSongLyric', newSong)
    const lyric = store.state.songLyric
    currentLyric.value = new Lyric(lyric.lrc, handleLyric)
    if (songReady.value) {
      playLyric()
    }
  })

  function playLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }

  function stopLyric() {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop(currentTime.value * 1000)
    }
  }

  function handleLyric({ lineNum, txt }) {
    currentLineNum.value = lineNum
    playingLyric.value = txt
    nextLineNum.value = lineNum + 1

    if (nextLineNum.value < currentLyric.value.lines.length) {
      const { txt } = currentLyric.value.lines[nextLineNum.value]
      nextLyric.value = txt
    }

    const scrollComp = lyricScrollRef.value
    const listEl = lyricListRef.value
    if (!listEl) {
      return
    }
    if (lineNum > 5) {
      const lineEl = listEl.children[lineNum - 5]
      scrollComp.scroll.scrollToElement(lineEl, 1000)
    } else {
      scrollComp.scroll.scrollTo(0, 0, 1000)
    }
  }
  return { lyricScrollRef, lyricListRef, currentLyric, currentLineNum, playLyric, stopLyric, playingLyric, nextLyric }
}

export default useLyric
