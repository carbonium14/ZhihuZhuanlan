<template>
  <Teleport to="#back">
  <div class="d-flex justify-content-center aligh-items-center h-100 loading-container" :style="{backgroundColor:background||''}">
    <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">{{text || 'Loading...'}}</span>
        </div>
        <p v-if="text" class="text-primary small">{{text}}</p>
    </div>
  </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import useDOMCreate from '../hook/useDOMCreate'
export default defineComponent({
  name: 'Loader',
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup () {
    useDOMCreate('back')
  }
})
</script>

<style>
.loading-container {
  background-color: rgba(255,255,255,0.5);
  z-index: 100;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.loading-container {
  text-align: center;
}
.loading-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
