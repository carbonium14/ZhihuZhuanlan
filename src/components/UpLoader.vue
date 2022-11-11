<template>
  <div class="file-upload">
    <div class="file-upload-container" @click.prevent="triggerUpload" v-bind="$attrs">
        <slot v-if="fileStatus === 'loading'" name="loading">
            <button class="btn btn-priamry" disabled>正在上传...</button>
        </slot>
        <slot v-else-if="fileStatus === 'success'" name="uploaded" :uploadedData="uploadedData">
            <button class="btn btn-priamry">上传成功</button>
        </slot>
        <span v-else name="default">
            <button class="btn btn-priamry">点击上传</button>
        </span>
    </div>
    <input type="file" class="file-input d-none" ref="fileInput" @change="handleFileChange">
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, PropType, ref, watch } from 'vue'
type UploadStatus = 'ready' | 'loading' | 'success' | 'error'
type CheckFunction = (file: File) => boolean
export default defineComponent({
  name: 'UpLoader',
  props: {
    action: {
      type: String,
      required: true
    },
    beforeUpload: {
      type: Function as PropType<CheckFunction>
    },
    uploaded: {
      type: Object
    }
  },
  inheritAttrs: false,
  emits: ['file-uploaded', 'file-uploaded-error'],
  setup (props, context) {
    const fileInput = ref<null | HTMLInputElement>(null)
    const fileStatus = ref<UploadStatus>(props.uploaded ? 'success' : 'ready')
    const uploadedData = ref(props.uploaded)
    watch(() => props.uploaded, (newval) => {
      if (newval) {
        fileStatus.value = 'success'
        uploadedData.value = newval
      }
    })
    const triggerUpload = () => {
      if (fileInput.value) {
        fileInput.value.click()
      }
    }
    const handleFileChange = (e: Event) => {
      const currentTarget = e.target as HTMLInputElement
      if (currentTarget.files) {
        const files = Array.from(currentTarget.files)
        if (props.beforeUpload) {
          const result = props.beforeUpload(files[0])
          if (!result) {
            return
          }
        }
        fileStatus.value = 'loading'
        const formData = new FormData()
        formData.append('file', files[0])
        axios.post(props.action, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((res) => {
          context.emit('file-uploaded', res.data)
          uploadedData.value = res.data
          fileStatus.value = 'success'
        }).catch((e) => {
          context.emit('file-uploaded-error', { e })
          fileStatus.value = 'error'
        }).finally(() => {
          if (fileInput.value) {
            fileInput.value.value = ''
          }
        })
      }
    }
    return {
      fileInput,
      triggerUpload,
      fileStatus,
      handleFileChange,
      uploadedData
    }
  }
})
</script>
