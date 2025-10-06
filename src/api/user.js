import request from '@/utils/request'

// 注册接口
export const userRegisterService = ({ username, password, repassword }) => 
  request.post('/api/reg', { username, password, repassword })

// 登录接口
export const userLoginService = ({ username, password }) => 
  request.post('/api/login', { username, password })

// 请求个人数据
export const userGetInfoService = () => request.get('/my/userinfo')

// 更新用户基本资料
export const userUpdateInfoService = ({ id, nickname, email }) => request.put('/my/userinfo', { id, nickname, email })
// 修改密码
export const userUpdatePassService = ({ old_pwd, new_pwd, re_pwd }) =>
  request.patch('/my/updatepwd', { old_pwd, new_pwd, re_pwd })