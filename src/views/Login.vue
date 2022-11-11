<template>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="from-label">邮箱地址</label>
        <ValidateInput :rules="emailRules" placeholder="请输入邮箱地址" type="text"></ValidateInput>
      </div>
      <div class="mb-3">
        <label class="from-label">密码</label>
        <ValidateInput :rules="passwordRules" placeholder="请输入密码" type="password"></ValidateInput>
      </div>
      <template #submit>
        <span class="btn btn-danger">提交</span>
      </template>
    </validate-form>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import createMessage from '../hook/createMessage'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const emailVal = ref('')
    const passwordVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的邮箱格式' }
    ]
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const payLoad = {
          email: emailVal.value,
          password: passwordVal.value
        }
        store.dispatch('loginAndFetch', payLoad).then(() => {
          createMessage('登陆成功! 2秒以后跳转到首页', 'success')
          setTimeout(() => {
            router.push('/')
          }, 2000)
        }).catch(e => {
          console.log(e)
        })
      }
    }
    return {
      emailRules,
      passwordRules,
      onFormSubmit
    }
  }
})
</script>
