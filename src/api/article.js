import request from '@/utils/request'
// 分类：获取文章分类
export const artGetChannelsService = () => request.get('/my/cate/list')
// 分类：新增文章分类
export const artAddChannelsService = (data) => request.post('/my/cate/add',data)
// 分类：编辑文章分类
export const artEditChannelsService = (data) => request.put('/my/cate/info',data)
// 分类：删除文章分类
export const artDelChannelsService = id => request.delete('/my/cate/del', {
  params:{ id }
})

// 文章：获取文章列表
export const artGetListService = (params) => request.get('/my/article/list', {
  params
})
// 文章：添加文章
export const artAddService = (data) => request.post('/my/article/add', data)
// 文章：获取文章详情
export const artGetDataService = (id) => request.get('/my/article/info', {
  params:{ id }
})
// 文章：修改文章
export const artEditService = (data) => request.put('/my/article/info', data)
// 文章：删除文章
export const artDelService = id => request.delete('/my/article/info', {
  params: { id }
})