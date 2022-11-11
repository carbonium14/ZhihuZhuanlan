import { Commit, createStore } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { arrToObj, objToArr } from './hook/helper'
export interface ResponseType<P> {
  code: number;
  msg: string;
  data: P;
}
export interface imageProps {
  _id?: string;
  url?: string;
  fitUrl?: string;
  createdAt?: string;
}
export interface userProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    description?: string;
    email?: string;
    avatar?: imageProps;
}
export interface ColumnProps {
  _id: string;
  title: string;
  avatar?: imageProps;
  description: string;
}
export interface PostProps {
  _id?: string;
  title: string;
  excerpt?: string;
  content?: string;
  image?: imageProps | string;
  column: string;
  author?: string | userProps;
  createAt?: string;
  isHTML?: boolean;
}
export interface ListProps<P> {
  [id: string]: P;
}
export interface LoadedPostProps {
  columnId?: string;
  currentPage?: number;
  total?: number;
}
export interface GlobalErrorProps {
  status: boolean;
  message?: string;
}
export interface GlobalDataProps {
  error: GlobalErrorProps;
  token: string;
  loading: boolean;
  columns: {
    data: ListProps<ColumnProps>;
    total: number;
    currentPage: number;
  };
  posts: {
    data: ListProps<PostProps>;
    loadedColumns: ListProps<LoadedPostProps>;
  };
  user: userProps
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit, extraData?: any) => {
  const { data } = await axios.get(url)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const postAndCommit = async (url: string, mutationName: string, commit: Commit, payLoad: any, extraData?: any) => {
  const { data } = await axios.post(url, payLoad)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}
const store = createStore<GlobalDataProps>({
  state: {
    error: { status: false },
    token: localStorage.getItem('token') || ' ',
    loading: false,
    columns: {
      data: {},
      total: 0,
      currentPage: 0
    },
    posts: {
      data: {},
      loadedColumns: {}
    },
    user: {
      isLogin: false
    }
  },
  mutations: {
    createPost (state, newPost) {
      state.posts.data[newPost._id] = newPost
    },
    fetchColumns (state, rawData) {
      const { data } = state.columns
      const { list, count, currentPage } = rawData.data
      state.columns = {
        data: { ...data, ...arrToObj(list) },
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchColumn (state, rawData) {
      state.columns.data[rawData.data._id] = rawData.data
    },
    fetchPosts (state, { data: rawData, extraData: columnId }) {
      const { data } = state.posts
      const { list, count, currentPage } = rawData.data
      state.posts.data = { ...data, ...arrToObj(list) }
      state.posts.loadedColumns[columnId] = {
        columnId: columnId,
        total: count,
        currentPage: currentPage * 1
      }
    },
    fetchPost (state, rawData) {
      state.posts.data[rawData.data._id] = rawData.data
    },
    deletePost (state, { data }) {
      delete state.posts.data[data._id]
    },
    updatePost (state, { data }) {
      state.posts.data[data._id] = data
    },
    setLoading (state, status) {
      state.loading = status
    },
    setError (state, e: GlobalErrorProps) {
      state.error = e
    },
    login (state, rawData) {
      state.token = rawData.data.token
      localStorage.setItem('token', rawData.data.token)
      axios.defaults.headers.common.Authorization = `Bearer ${rawData.data.token}`
    },
    fetchCurrentUser (state, rawData) {
      state.user = { isLogin: true, ...rawData }
    },
    logout (state) {
      state.token = ''
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    }
  },
  actions: {
    fetchColumns ({ state, commit }, params = {}) {
      const { currentPage = 1, pageSize = 6 } = params
      if (state.columns.currentPage < currentPage) {
        return getAndCommit(`/columns?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchColumns', commit)
      }
    },
    fetchColumn ({ state, commit }, cid) {
      if (!state.columns.data[cid]) {
        return getAndCommit(`/columns/${cid}`, 'fetchColumn', commit)
      }
    },
    fetchPosts ({ state, commit }, params = {}) {
      const { columnId, currentPage = 1, pageSize = 5 } = params
      const loadedPost = state.posts.loadedColumns[columnId]
      if (!loadedPost) {
        return getAndCommit(`/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, columnId)
      } else {
        const loadedPostCurrentPage = loadedPost.currentPage || 0
        if (loadedPostCurrentPage < currentPage) {
          return getAndCommit(`/api/columns/${columnId}/posts?currentPage=${currentPage}&pageSize=${pageSize}`, 'fetchPosts', commit, columnId)
        }
      }
    },
    fetchPost ({ state, commit }, id) {
      const currentPost = state.posts.data[id]
      if (!currentPost || !currentPost.content) {
        return getAndCommit(`/posts/${id}`, 'fetchPost', commit, id)
      } else {
        return Promise.resolve({ data: currentPost })
      }
    },
    updatePost ({ commit }, { id, payLoad }) {
      return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
        method: 'patch',
        data: payLoad
      })
    },
    fetchCurrentUser ({ commit }) {
      return getAndCommit('/user/current', 'fetchCurrentUser', commit)
    },
    login ({ commit }, payLoad) {
      return postAndCommit('/user/login', 'login', commit, payLoad)
    },
    createPost ({ commit }, payLoad) {
      return postAndCommit('/posts', 'createPost', commit, payLoad)
    },
    deletePost ({ commit }, id) {
      return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, {
        method: 'delete'
      })
    },
    loginAndFetch ({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUser')
      })
    }
  },
  getters: {
    getColumn: (state) => {
      return objToArr(state.columns)
    },
    getColumnById: (state) => (id: string) => {
      return state.columns.data[id]
    },
    getPostById: (state) => (cid: string) => {
      return objToArr(state.posts).filter((post: { column: string }) => post.column === cid)
    },
    getCurrentPost: (state) => (id: string) => {
      return state.posts.data[id]
    },
    getLoadedPost: (state) => (id: string) => {
      return state.posts.loadedColumns[id]
    }
  }
})
export default store
