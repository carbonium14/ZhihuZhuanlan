<template>
  <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
    <router-link class="navbar-brand" to="/">专栏</router-link>
    <ul v-if="!user.isLogin" class="list-inline mb-0">
        <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登录</router-link></li>
        <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
    </ul>
    <ul v-else class="list-inline mb-0">
        <li class="list-inline-item">
            <drop-down :title="`你好，${user.nickName}`">
                <drop-down-item>
                    <router-link to="/create" class="dropdown-item">新建文章</router-link>
                </drop-down-item>
                <drop-down-item>
                    <router-link :to="`/column/${user.column}`" class="dropdown-item">我的专栏</router-link>
                </drop-down-item>
                <drop-down-item disabled>
                    <a href="#" class="dropdown-item">编辑资料</a>
                </drop-down-item>
                <drop-down-item>
                    <a href="#" class="dropdown-item">退出登录</a>
                </drop-down-item>
            </drop-down>
        </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import DropDown from './DropDown.vue'
import DropDownItem from './DropDownItem.vue'
import { userProps } from '../store'
export default defineComponent({
  name: 'GlobalHeader',
  components: {
    DropDown,
    DropDownItem
  },
  props: {
    user: {
      type: Object as PropType<userProps>,
      required: true
    }
  }
})
</script>
