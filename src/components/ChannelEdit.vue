<script setup>
import { ref } from 'vue'
import { artAddChannelsService, artEditChannelsService } from '@/api/article'
const dialogVisible = ref(false)
// 表单元素绑定
const formRef = ref()
// 默认表单数据
const formModel = ref({
  cate_name: '',
  cate_alias: ''
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    {
      pattern: /^\S{1,10}$/,
      message: '分类名必须是1-10位的非空字符',
      trigger: 'blur'
    }
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9]{1,15}$/,
      message: '分类别名必须是1-15位的字母数字',
      trigger: 'blur'
    }
  ]
}
const emit = defineEmits(['success'])
// 点编辑的时候，就已经传入formModel数据,存在id，可以进行识别
const open = (row) => {
  dialogVisible.value = true
  formModel.value = { ...row }
}
const onSubmit = async () => {
  await formRef.value.validate()
  if (formModel.value.id) {
    // 编辑
    const res = await artEditChannelsService(formModel.value)
  } else {
    // 添加
    await artAddChannelsService(formModel.value)
  }
  dialogVisible.value = false
  emit('success')
}
defineExpose({
  open
})
</script>
<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="500">
    <el-form :model="formModel" :rules="rules" style="padding: 10px 30px;" ref="formRef">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input placeholder="请输入分类名称" v-model="formModel.cate_name"></el-input>
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input placeholder="请输入分类别名" v-model="formModel.cate_alias"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>