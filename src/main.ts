import { createApp } from 'vue'
import axios from 'axios'
// http://apis.imooc.com/api?icode=C6A6C4086133360B
import router from './router'
import store from './store'
import App from './App.vue'
axios.defaults.baseURL = 'http://apis.imooc.com/api/'
axios.interceptors.request.use(config => {
  config.params = { ...config.params, icode: 'C6A6C4086133360B' }
  store.commit('setLoading', true)
  store.commit('setError', { status: true, message: '' })
  return config
})
axios.interceptors.response.use(config => {
  store.commit('setLoading', false)
  return config
}, e => {
  const { error } = e.response.data
  store.commit('setError', { status: true, message: error })
  store.commit('setLoading', false)
  return Promise.reject(error)
})
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
