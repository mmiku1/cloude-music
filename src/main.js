import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lazyPlugin from 'vue3-lazy'
import { loadingDirective, noresultDirective } from '@/utils/use-directive'

import '@/assets/scss/index.scss'
createApp(App).use(store).use(router).use(lazyPlugin, {
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).directive('no-result', noresultDirective).mount('#app')
