<template>
  <form class="validate-from-container">
    <slot name="default"></slot>
    <div class="submit-area" @click.prevent="submitForm">
        <slot name="submit">
            <button type="submit" class="btn btn-primary">提交</button>
        </slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from 'vue'
import mitt from 'mitt'
type validateFunc = () => boolean
export const emitter = mitt<any>()
export default defineComponent({
  name: 'ValidateForm',
  emits: ['form-submit'],
  setup (props, context) {
    let funcArr: validateFunc[] = []
    const submitForm = () => {
      const result = funcArr.map((func) => {
        return func()
      }).every((result) => {
        return result
      })
      context.emit('form-submit', result)
    }
    const callback = (func: validateFunc) => {
      funcArr.push(func)
    }
    emitter.on('form-item-created', callback)
    onUnmounted(() => {
      emitter.off('form-item-created', callback)
      funcArr = []
    })
    return {
      submitForm
    }
  }
})
</script>
