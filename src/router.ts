import { createRouter, createWebHistory } from 'vue-router'
import store from './store'
import axios from 'axios'
// import Home from './views/Home.vue'
// import Login from './views/Login.vue'
// import ColumnDetail from './views/ColumnDetail.vue'
// import CreatePost from './views/CreatePost.vue'
// import Signup from './views/Signup.vue'
// import PostDetail from './views/PostDetail.vue'
const Home = () => import('./views/Home.vue')
const Login = () => import('./views/Login.vue')
const ColumnDetail = () => import('./views/ColumnDetail.vue')
const CreatePost = () => import('./views/CreatePost.vue')
const Signup = () => import('./views/Signup.vue')
const PostDetail = () => import('./views/PostDetail.vue')
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
      meta: {
        redirectAlreadyLogin: true
      }
    },
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    },
    {
      path: '/posts/:id',
      name: 'post',
      component: PostDetail
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      meta: {
        requiredLogin: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const { user, token } = store.state
  const { redirectLogin, redirectAlreadyLogin } = to.meta
  if (!user.isLogin) {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`
      store.dispatch('fetchCurrentUser').then(() => {
        if (redirectAlreadyLogin) {
          next('/')
        } else {
          next()
        }
      }).catch(() => {
        store.commit('logout')
        next('login')
      })
    } else {
      if (redirectLogin) {
        next('login')
      } else {
        next()
      }
    }
  } else {
    if (redirectAlreadyLogin) {
      next('/')
    } else {
      next()
    }
  }
})
export default router
