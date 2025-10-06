// 校验必需参数
const validateRequired = (fields, fieldNames) => {
  for (let i = 0; i < fields.length; i++) {
    if (!fields[i]) {
      return {
        isValid: false,
        error: {
          code: 2,
          message: `"${fieldNames[i]}" is required`
        }
      }
    }
  }
  return { isValid: true }
}

// 校验用户名格式
const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9]{1,10}$/
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '用户名必须是1-10位的大小写字母和数字'
      }
    }
  }
  return { isValid: true }
}

// 校验密码格式
const validatePassword = (password) => {
  const passwordRegex = /^\S{6,15}$/
  if (!passwordRegex.test(password)) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '密码必须是6-15位的非空字符'
      }
    }
  }
  return { isValid: true }
}

// 校验密码一致性
const validatePasswordMatch = (password, repassword) => {
  if (password !== repassword) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '两次输入的密码不一致'
      }
    }
  }
  return { isValid: true }
}

// 检查用户名是否已存在
const checkUsernameExists = (db, username) => {
  const existingUser = db.get('users').find({ username }).value()
  if (existingUser) {
    return {
      exists: true,
      error: {
        code: 1,
        message: '用户名被占用，请更换其他用户名！'
      }
    }
  }
  return { exists: false }
}

// 验证用户登录凭据
const validateLoginCredentials = (db, username, password) => {
  const user = db.get('users').find({ username }).value()
  
  if (!user) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '用户名或密码错误'
      }
    }
  }
  
  if (user.password !== password) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '用户名或密码错误'
      }
    }
  }
  
  return { isValid: true, user }
}

// 极简token生成 - 直接使用用户名+时间戳
const generateToken = (username) => {
  return `token_${username}_${Date.now()}`
}

// 校验分类名称格式 (1-10个非空格字符)
const validateCateName = (cate_name) => {
  const cateNameRegex = /^\S{1,10}$/
  if (!cateNameRegex.test(cate_name)) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '分类名称必须是1-10个非空格字符'
      }
    }
  }
  return { isValid: true }
}

// 校验分类别名格式 (1-15个大小写字母和数字)
const validateCateAlias = (cate_alias) => {
  const cateAliasRegex = /^[a-zA-Z0-9]{1,15}$/
  if (!cateAliasRegex.test(cate_alias)) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '分类别名必须是1-15个大小写字母和数字'
      }
    }
  }
  return { isValid: true }
}

// 校验ID格式 (必须大于等于1的整数)
const validateId = (id) => {
  const idNum = parseInt(id)
  if (isNaN(idNum) || idNum < 1) {
    return {
      isValid: false,
      error: {
        code: 2,
        message: '"id" must be greater than or equal to 1'
      }
    }
  }
  return { isValid: true }
}

// 校验文章标题格式 (1-30个任意字符)
const validateArticleTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      error: {
        code: 2,
        message: '"title" is required'
      }
    }
  }
  
  if (title.length < 1 || title.length > 30) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '文章标题必须是1-30个字符'
      }
    }
  }
  
  return { isValid: true }
}

// 校验文章状态 (只能是"已发布"或"草稿")
const validateArticleState = (state) => {
  const validStates = ['已发布', '草稿']
  if (!validStates.includes(state)) {
    return {
      isValid: false,
      error: {
        code: 2,
        message: '"state" must be one of [草稿, 已发布]'
      }
    }
  }
  return { isValid: true }
}

// 校验分类ID是否存在
const validateCateIdExists = (db, username, cate_id) => {
  const user = db.get('users').find({ username }).value()
  if (!user) {
    return {
      exists: false,
      error: {
        code: 1,
        message: '用户不存在'
      }
    }
  }
  
  const cates = user.cates || []
  const cateExists = cates.some(cate => cate.id == cate_id)
  
  if (!cateExists) {
    return {
      exists: false,
      error: {
        code: 1,
        message: '文章分类不存在'
      }
    }
  }
  
  return { exists: true }
}
// 校验邮箱格式
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '邮箱格式不正确'
      }
    }
  }
  return { isValid: true }
}

// 校验昵称格式 (1-10位非空格字符)
const validateNickname = (nickname) => {
  const nicknameRegex = /^\S{1,10}$/
  if (!nicknameRegex.test(nickname)) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '用户昵称必须是1-10位的非空格字符'
      }
    }
  }
  return { isValid: true }
}

// 校验旧密码是否正确
const validateOldPassword = (db, username, oldPassword) => {
  const user = db.get('users').find({ username }).value()
  if (!user) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '用户不存在'
      }
    }
  }
  
  if (user.password !== oldPassword) {
    return {
      isValid: false,
      error: {
        code: 1,
        message: '原密码错误'
      }
    }
  }
  
  return { isValid: true }
}
module.exports = {
  validateRequired,
  validateUsername,
  validatePassword,
  validatePasswordMatch,
  checkUsernameExists,
  validateLoginCredentials,
  generateToken,
  validateCateName,
  validateCateAlias,
  validateId,
  validateArticleTitle,
  validateArticleState,
  validateCateIdExists,
  validateEmail,        // 新增
  validateNickname,     // 新增
  validateOldPassword   // 新增
}