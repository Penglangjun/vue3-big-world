<script setup>
import { artDelChannelsService, artGetChannelsService } from '@/api/article';
import { ref } from 'vue'
import {
  Delete,
  Edit
} from '@element-plus/icons-vue'


const loading = ref(false)
const dialog = ref()
const channleList = ref([])
const getChannelList = async () => {
  loading.value = true
  const res = await artGetChannelsService()
  channleList.value = res.data.data
  loading.value = false

}
getChannelList()
// const indexMethod = (index) => {
//   return index++
// }
// 编辑分类
const editArt = (row, $index) => {
  dialog.value.open(row)
}
// 添加分类
const addArt = () => {
  dialog.value.open()
}
const deleteArt = async (row) => {
  await ElMessageBox.confirm('确定删除该分类？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  const res = await artDelChannelsService(row.id)
  getChannelList()
  ElMessage.success('删除成功')
}
const onSuccess = () => {
  getChannelList()
}
</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button type="primary" @click="addArt">添加分类</el-button>
    </template>
    <!-- :data绑定对象数组 prop填入键名 -->
    <el-table :data="channleList" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="序号" width="180" />
      <el-table-column prop="cate_name" label="分类名称" width="180" />
      <el-table-column prop="cate_alias" label="分类别名" />
      <el-table-column label="操作" width="100">
        <!-- scope是具名插槽的对象，这里用row 和 $index俩值 -->
        <template #default="scope">
          <el-button plain type="primary" :icon="Edit" circle @click="editArt(scope.row, scope.$index)" />
          <el-button plain type="danger" :icon="Delete" circle @click="deleteArt(scope.row)" />
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="没有数据"></el-empty>
      </template>
    </el-table>
  </page-container>
  <!-- 编辑组件使用 -->
  <ChannelEdit ref="dialog" @success="onSuccess"></ChannelEdit>
</template>
<style scoped></style>