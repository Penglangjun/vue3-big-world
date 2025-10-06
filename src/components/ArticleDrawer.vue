<script setup>
import { ref, nextTick } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { artAddService, artEditService, artGetDataService } from '@/api/article';
import { ElMessage } from 'element-plus';
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 1, max: 15, message: '标题长度需在1到15个字符之间', trigger: 'blur' }
  ],
  cate_id: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ]
}
// 控制抽屉开关属性
const visibleDrawer = ref(false)
const formRef = ref()
const editorRef = ref()
// 默认文章提交数据
const defaultForm = {
  title: '',
  cate_id: '',
  cover_img: '',
  content: '',
  state: ''
}
const formModel = ref({ ...defaultForm })
const open = async (row) => {
  visibleDrawer.value = true
  if (row.id) {
    // 获取文章详情
    const res = await artGetDataService(row.id)
    formModel.value = res.data
    console.log(formModel.value);

  } else {
    // 添加
    formModel.value = { ...defaultForm }
    await nextTick()
    editorRef.value?.setHTML('') // 安全调用
  }

}
defineExpose({
  open
})
// 提交逻辑
const emit = defineEmits(['success'])
const onSubmit = async (state) => {
  formModel.value.state = state
  // 将数据处理成frommdata格式
  const fd = new FormData()
  for (let k in formModel.value)
    fd.append(k, formModel.value[k])

  if (formModel.value.id) {
    // 编辑逻辑
    const res = await artEditService(fd)
    emit('success', 'edit')
    visibleDrawer.value = false

  } else {
    // 添加逻辑
    const res = await artAddService(fd)
    ElMessage.success("添加成功")
    visibleDrawer.value = false
    emit('success', 'add')
  }
}
</script>
<template>
  <el-drawer v-model="visibleDrawer" :title="formModel.id ? '编辑文章' : '添加文章'" direction="rtl" size="50%">
    <!-- 发表文章表单 -->
    <el-form :model="formModel" :rules="rules" ref="formRef" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="formModel.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="文章分类" prop="cate_id">
        <!-- 文章分类组件使用 -->
        <channel-select v-model="formModel.cate_id" width="100%"></channel-select>
      </el-form-item>
      <el-form-item label="文章封面" prop="cover_img"> 文件上传 </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="editor">
          <!-- 富文本编辑器组件 -->
          <QuillEditor theme="snow" ref="editorRef" v-model:content="formModel.content" content-type="html">
          </QuillEditor>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button @click="onSubmit('已发布')" type="primary">发布</el-button>
        <el-button @click="onSubmit('草稿')" type="info">草稿</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<style scoped>
.editor {
  width: 100%;
}

::v-deep(.ql-editor) {
  min-height: 200px;
}
</style>