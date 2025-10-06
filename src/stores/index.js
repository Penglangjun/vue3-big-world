// 实现 pinia 单独维护

import { createPinia } from 'pinia'
// 持久化
import persist from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(persist)

export default pinia

// 将index.js作为pinia仓库的唯一出口
// import { useUserStore } from './stores/modules/user'
// export { useUserStore }
export * from '@/stores/modules/user'
export * from '@/stores/modules/counter'