<template>
    <div class="create-post-page container">
      <h4>{{isEditMode?'编辑文章':'新建文章'}}</h4>
      <up-loader action="/upload" :before-upload="uploadCheck" @file-uploaded="handleFileUploaded" :uploaded="uploadedData" class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4">
        <h2>点击上传头图</h2>
        <template #loading>
          <div class="d-flex">
            <div class="spinner-border text-secondary" role="status">
              <span class="sr-only">Loading...</span>
            </div>
            <h2>正在上传</h2>
          </div>
        </template>
        <template #uploaded="dataProps">
          <img :src="dataProps.uploadedData.data.url" >
        </template>
      </up-loader>
      <validate-form @form-submit="onFormSubmit">
        <div class="mb-3">
          <label class="form-label">文章标题：</label>
          <validate-input :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text"/>
        </div>
        <div class="mb-3">
          <label class="form-label">文章详情：</label>
          <validate-input rows="10" type="text" tag="textarea" placeholder="请输入文章详情" :rules="contentRules" v-model="contentVal"/>
        </div>
        <template #submit>
          <button class="btn btn-primary btn-large">{{isEditMode?'更新文章':'发表文章'}}</button>
        </template>
      </validate-form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import axios from 'axios'
import { GlobalDataProps, PostProps, ResponseType, imageProps } from '../store'
import ValidateForm from '../components/ValidateForm.vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import UpLoader from '../components/UpLoader.vue'
import { beforeUploadCheck } from '../hook/helper'
import createMessage from '../hook/createMessage'
export default defineComponent({
  name: 'CreatePost',
  components: {
    ValidateForm,
    ValidateInput,
    UpLoader
  },
  setup () {
    const titleVal = ref('')
    const uploadedData = ref()
    const router = useRouter()
    const route = useRoute()
    const isEditMode = !!route.query.id
    const store = useStore<GlobalDataProps>()
    let imageid = ''
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    onMounted(() => {
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })
    const handleFileUploaded = (rawData: ResponseType<imageProps>) => {
      if (rawData.data._id) {
        imageid = rawData.data._id
      }
    }
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            title: titleVal.value,
            content: contentVal.value,
            column: column,
            author: _id
          }
          if (imageid) {
            newPost.image = imageid
          }
          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payLoad: newPost
          } : newPost
          store.dispatch(actionName, sendData).then(() => {
            createMessage('发表成功, 2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            }, 2000)
          })
        }
      }
    }
    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        formData.append(uploadedFile.name, uploadedFile)
        axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
      }
    }
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, {
        format: ['image/jpeg', 'image/png'],
        size: 1
      })
      const { passed, error } = result
      if (error === 'format') {
        createMessage('上传图片只能是JPG或者PNG格式!', 'error')
      }
      if (error === 'size') {
        createMessage('上传图片大小不能超过1MB!', 'error')
      }
      return passed
    }
    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit,
      handleFileChange,
      uploadCheck,
      handleFileUploaded,
      uploadedData,
      isEditMode
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}
.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
