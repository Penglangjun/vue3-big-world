<script setup>
import { ref } from 'vue'
import { artGetChannelsService } from '@/api/article'
defineProps({
  width: String
})
const channelList = ref([])
const getChannelList = async () => {
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  console.log('分类列表:', channelList.value)
}
const modelValue = defineModel()

getChannelList()
</script>

<template>
  <el-select v-if="channelList.length" placeholder="请选择" v-model="modelValue" :style="{ width }">
    <!-- 这里value设置的值是id，所以返回给父组件的值也是id -->
    <el-option v-for="item in channelList" :key="item.id" :label="item.cate_name" :value="item.id"></el-option>
  </el-select>
</template>