import { createRouter, createWebHistory } from 'vue-router'
import MyDiscover from '@/views/discover/Discover.vue'
import MyRecommend from '@/views/Recommend.vue'
import TheSinger from '@/views/singer/Singer.vue'
import SingerDetail from '@/views/singer/SingerDetail.vue'
import MyPage from '@/views/MyPage.vue'
import CareChoice from '@/views/discover/CareChoice.vue'
import TopList from '@/views/TopList.vue'
import SongList from '@/views/PodCast.vue'
import HelpSleep from '@/views/HelpSleep.vue'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: MyRecommend

  },
  {
    path: '/discover',
    redirect: '/discover/carechoice',
    component: MyDiscover,
    children: [
      {
        path: '/discover/carechoice',
        component: CareChoice
      },
      {
        path: '/discover/toplist',
        component: TopList
      },
      {
        path: '/discover/podcast',
        component: SongList
      },
      {
        path: '/discover/helpsleep',
        component: HelpSleep
      }
    ]
  },
  {
    path: '/singer',
    component: TheSinger,
    children: [
      {
        path: ':id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/mypage',
    component: MyPage
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
