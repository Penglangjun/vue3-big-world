<script setup>
import { ref } from 'vue'
import {
  Delete,
  Edit
} from '@element-plus/icons-vue'
import { artDelService, artGetDataService, artGetListService } from '@/api/article'

// 文章列表数据
const articleList = ref([])
// 总条数
const total = ref(0)
// 定义分类查询的请求参数
const params = ref({
  pagenum: 1,
  pagesize: 5,
  cate_id: '',
  state: ''
})

const loading = ref(false)
// 获取文章列表
const getArticleList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArticleList()
// 绑定文章抽屉组件
const articelEdit = ref()
// 添加文章
const addDrawer = () => {
  articelEdit.value.open({})
}
// 编辑文章
const editArticle = (row) => {
  articelEdit.value.open(row)
}
// 删除文章
const deleteArticle = async (row) => {
  await ElMessageBox.confirm('确定删除该分类？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await artDelService(row.id)
  getArticleList()
  ElMessage.success('删除成功')
}
// 处理分页逻辑
const handleSizeChange = (size) => {
  // 每页条数变化了，需要重新渲染
  params.value.pagenum = 1
  params.value.pagesize = size
  getArticleList()
}
const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getArticleList()
}
// 搜索功能
const onSearch = () => {
  params.value.pagenum = 1
  getArticleList()
  console.log(params.value);
}
// 重置功能
const onReset = () => {
  params.value.pagenum = 1
  params.value.cate_id = '',
    params.value.state = ''
  getArticleList()
}
// 预览文章
// 控制弹窗显示
const previewVisible = ref(false)
// 预览的文章数据
const previewData = ref({})
// 点击预览文章
const onShowArticle = async (row) => {
  previewVisible.value = true
  const res = await artGetDataService(row.id)
  previewData.value = res.data
  console.log(previewData.value);

}

const onSuccess = (type) => {
  if (type === 'add') {
    params.value.pagenum = 1
    getArticleList()
  } else {
    getArticleList()
  }
}

</script>
<template>
  <page-container title="文章管理">
    <template #extra>
      <el-button @click="addDrawer" type="primary">发布文章</el-button>
    </template>
    <!-- 筛选显示表单 -->
    <el-form :inline="true">
      <el-form-item label="文章分类：">
        <!-- 使用分类选择组件 -->
        <channel-select v-model="params.cate_id"></channel-select>
      </el-form-item>
      <el-form-item label="发布状态：">
        <el-select placeholder="请选择" v-model="params.state">
          <el-option label="已发布" value="已发布"></el-option>
          <el-option label="草稿" value="草稿"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSearch" type="primary">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 文章展示表格 -->
    <el-table :data="articleList" v-loading="loading">
      <el-table-column label="文章标题" width="400">
        <template #default="scope">
          <el-link @click="onShowArticle(scope.row)">{{ scope.row.title }}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="分类" prop="cate_name"></el-table-column>
      <el-table-column label="发表时间" prop="pub_date"> </el-table-column>
      <el-table-column label="状态" prop="state"></el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="scope">
          <el-button :icon="Edit" circle plain type="primary" @click="editArticle(scope.row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="deleteArticle(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 底部分页 -->
    <el-pagination v-model:currentPage="params.pagenum" v-model:page-size="params.pagesize" :page-sizes="[2, 3, 5, 10]"
      :background="true" layout="jumper, total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    <!-- 文章发布&编辑抽屉组件 -->
    <ArticleDrawer ref="articelEdit" @success="onSuccess"></ArticleDrawer>
  </page-container>
  <!-- 文章预览组件 -->
  <el-dialog v-model="previewVisible" width="800px" center draggable :show-close="false" class="article-preview-dialog">
    <template #title>
      <div class="dialog-header">
        <h2>{{ previewData.title }}</h2>
      </div>
    </template>

    <div class="article-preview-body">
      <div class="meta">
        <span>作者：{{ previewData.nickname }}</span>
        <span>分类：{{ previewData.cate_name }}</span>
        <span>发布时间：{{ previewData.pub_date }}</span>
        <span>状态：{{ previewData.state }}</span>
      </div>

      <div class="content" v-html="previewData.content"></div>
    </div>

    <template #footer>
      <el-button type="primary" @click="previewVisible = false">关闭</el-button>
    </template>
  </el-dialog>


</template>
<style scoped>
.el-select {
  width: 240px;
}

.el-link {
  color: rgb(52, 171, 218);
  text-decoration: none;
}

/* 拖拽样式 */
.el-dialog__header {
  cursor: move;
}

.article-preview-dialog .dialog-header {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.article-preview-dialog h2 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.article-preview-body {
  padding: 20px;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.article-preview-body .meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.article-preview-body .content {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 6px;
  border: 1px solid #eee;
  min-height: 100px;
}
</style>