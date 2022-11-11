<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center">
        <div class="col-3 text-center">
            <img :src="column?.avatar && column.avatar.url" :alt="column?.title" class="rounded-circle border w-100">
        </div>
        <div class="col-9">
            <h4>{{column?.title}}</h4>
            <p class="text-muted">{{column?.description}}</p>
        </div>
        <post-list :list="postList"></post-list>
        <button
          v-if="!isLastPage"
          @click="loadMorePage"
          class="btn btn-outline-primary mt-2 mb-5 mx-auto btn-block w-25 load-more"
        >加载更多</button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { ColumnProps, GlobalDataProps } from '../store'
import { generateFitUrl } from '../hook/helper'
import PostList from '../components/PostList.vue'
import useLoadMore from '../hook/useLoadMore'
type ColumnIdProps = string | undefined
export default defineComponent({
  name: 'ColumnDetail',
  components: {
    PostList
  },
  setup () {
    const route = useRoute()
    const store = useStore<GlobalDataProps>()
    const currentId = route.params.id as ColumnIdProps
    const loaded = reactive({
      currentPage: 0,
      total: 0
    })
    const total = computed(() => loaded.total)
    watch(store.state.posts.loadedColumns, () => {
      const { currentPage, total } = store.getters.getLoadedPost(currentId)
      loaded.currentPage = currentPage
      loaded.total = total
    })
    onMounted(() => {
      store.dispatch('fetchColumn', currentId)
      store.dispatch('fetchPosts', { columnId: currentId, pageSize: 3 })
    })
    const column = computed(() => {
      const selectColumn = store.getters.getColumnById(currentId) as ColumnProps | undefined
      if (selectColumn) {
        generateFitUrl(selectColumn, 100, 100)
      }
      return selectColumn
    })
    const params = {
      columnId: currentId,
      pageSize: 5,
      currentPage: loaded.currentPage ? loaded.currentPage + 1 : 2
    }
    const { loadMorePage, isLastPage } = useLoadMore('fetchPosts', total, params)
    const postList = computed(() => store.getters.getPostById(currentId))
    return {
      route,
      column,
      loadMorePage,
      isLastPage,
      postList
    }
  }
})
</script>
