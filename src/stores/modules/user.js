import { defineStore } from "pinia"
import { ref } from 'vue'
import { userGetInfoService } from "@/api/user"
export const useUserStore = defineStore('big-user', () => {
  // token模块
  const token = ref('')
  const setToken = (newToken) => {
    token.value = newToken
  }
  const removeToken = () => {
    token.value = ''
  }

  // 个人信息模块
  const user = ref({})
  const getUser = async () => {
    const res = await userGetInfoService()
    user.value = res.data
  }
  const setUser = (obj) => {
    user.value = obj
  }
  return {
    token,
    setToken,
    removeToken,
    user,
    getUser,
    setUser
  }

},
  //  记得写在第三个参数中而不是回调函数
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'big-user',
          storage: localStorage,
        }
      ]
    }
  }

)