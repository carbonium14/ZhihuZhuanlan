<template>
    <div class="post-list">
      <article v-for="post in posts" :key="post._id" class="card mb-3 shadow-sm">
        <div class="card-body">
          <h4><router-link :to="`/posts/${post._id}`">{{post.title}}</router-link></h4>
          <div class="row my-3 align-items-center">
            <div v-if="post.image" class="col-4">
              <img :src="post.image && post.image.fitUrl" :alt="post.title" class="rounded-lg w-100">
            </div>
            <p :class="{'col-9': post.image}">{{post.excerpt}}</p>
          </div>
          <span class="text-muted">{{post.createAt}}</span>
        </div>
      </article>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import { PostProps, imageProps } from '../store'
import { generateFitUrl } from '../hook/helper'
export default defineComponent({
  props: {
    list: {
      required: true,
      type: Array as PropType<PostProps[]>
    }
  },
  setup (props) {
    const posts = computed(() => {
      return props.list.map(post => {
        generateFitUrl(post.image as imageProps, 200, 110, ['m_fill'])
        return post
      })
    })
    return {
      posts
    }
  }
})
</script>

<style scoped>
.post-list h4 a {
  text-decoration: none;
  color:#1a1a1a;
}
.post-list h4 a:hover {
  color:#0d6efd;
}
</style>
