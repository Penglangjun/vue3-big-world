const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// 导入工具函数
const { 
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
  validateEmail,
  validateNickname,   
  validateOldPassword 
} = require('./utils/validators')

const { sendErrorResponse, sendSuccessResponse } = require('./utils/response')
const multer = require('multer')
const upload = multer()
// 设置中间件
server.use(middlewares)
server.use(jsonServer.bodyParser)

// 简单的用户token存储（内存中）
const userTokens = new Map()

// 简化的认证中间件
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']
  
  if (!token) {
    return sendErrorResponse(res, {
      code: 1,
      message: '身份认证失败！'
    })
  }
  
  // 直接查找token对应的用户名
  let username = null
  for (let [user, userToken] of userTokens.entries()) {
    if (userToken === token) {
      username = user
      break
    }
  }
  
  if (!username) {
    return sendErrorResponse(res, {
      code: 1,
      message: '身份认证失败！'
    })
  }
  
  req.user = { username }
  next()
}

// 自定义注册接口 
server.post('/api/reg', (req, res) => {
  const { username, password, repassword } = req.body
  const db = router.db
  
  // 1. 校验必需参数
  const requiredCheck = validateRequired(
    [username, password, repassword], 
    ['username', 'password', 'repassword']
  )
  if (!requiredCheck.isValid) {
    return sendErrorResponse(res, requiredCheck.error)
  }
  
  // 2. 校验用户名格式
  const usernameCheck = validateUsername(username)
  if (!usernameCheck.isValid) {
    return sendErrorResponse(res, usernameCheck.error)
  }
  
  // 3. 校验密码格式
  const passwordCheck = validatePassword(password)
  if (!passwordCheck.isValid) {
    return sendErrorResponse(res, passwordCheck.error)
  }
  
  // 4. 校验密码一致性
  const passwordMatchCheck = validatePasswordMatch(password, repassword)
  if (!passwordMatchCheck.isValid) {
    return sendErrorResponse(res, passwordMatchCheck.error)
  }
  
  // 5. 检查用户名是否已存在
  const usernameExistsCheck = checkUsernameExists(db, username)
  if (usernameExistsCheck.exists) {
    return sendErrorResponse(res, usernameExistsCheck.error)
  }
  
  // 6. 创建新用户（包含空的分类数组）
  const newUser = {
    id: Date.now(),
    username,
    password, 
    email: '',
    nickname: username,
    avatar: '',
    cates: [
      {
        "id": 10707,
        "cate_name": "科技",
        "cate_alias": "keji"
      },
      {
        "id": 10718,
        "cate_name": "历史",
        "cate_alias": "lishi"
      },
      {
        "id": 10728,
        "cate_name": "文化",
        "cate_alias": "keji"
      },
      {
        "id": 10730,
        "cate_name": "时政",
        "cate_alias": "lishi"
      },
      {
        "id": 10748,
        "cate_name": "娱乐",
        "cate_alias": "keji"
      },
      {
        "id": 10756,
        "cate_name": "体育",
        "cate_alias": "lishi"
      }
    ], // 初始化数据
    "articles": [
      {
        "id": 1759714760102,
        "title": "按时发放",
        "cate_id": 10718,
        "cate_name": "历史",
        "content": "<p>盎司大</p>",
        "state": "已发布",
        "pub_date": "2025年10月6日",
        "cover_img": ""
      },
      {
        "id": 1759714760103,
        "title": "中国古代科技发展史",
        "cate_id": 10707,
        "cate_name": "科技",
        "content": "<h2>中国古代科技的辉煌成就</h2><p>中国古代科技发展源远流长，从四大发明到农业技术，从医学到天文学，都取得了举世瞩目的成就。造纸术的发明极大地促进了文化的传播和发展，使知识的记录和传承变得更加便捷。</p><p>指南针的发明为航海事业提供了重要工具，促进了世界各地的交流与贸易。火药的发明不仅改变了战争的方式，还在矿山开采和工程建设中发挥了重要作用。</p><p>印刷术的发明使书籍的大规模生产成为可能，极大地推动了文化的普及和教育的发展。这些发明不仅对中国，对全世界都产生了深远的影响。</p><h2>农业技术的发展</h2><p>中国古代农业技术也十分发达，铁制农具的广泛使用、水利工程的建设、耕作技术的改进等都大大提高了农业生产效率。曲辕犁的发明使耕作更加省力高效，都江堰水利工程至今仍在发挥作用。</p><p>这些农业技术的进步为中国古代社会的稳定和发展提供了坚实的物质基础，也为我们今天的农业发展留下了宝贵的经验。</p>",
        "state": "已发布",
        "pub_date": "2025年10月5日",
        "cover_img": ""
      },
      {
        "id": 1759714760104,
        "title": "唐朝文化的繁荣与影响",
        "cate_id": 10718,
        "cate_name": "历史",
        "content": "<h2>唐朝的开放与包容</h2><p>唐朝是中国历史上最为开放和包容的朝代之一，长安城作为当时的世界性大都市，吸引了来自世界各地的商人、学者和使节。这种开放的环境促进了文化的交流与融合。</p><p>唐朝的音乐、舞蹈、绘画等艺术形式都受到了外来文化的影响，形成了独具特色的盛唐文化。诗歌在唐朝达到了巅峰，李白、杜甫、白居易等伟大诗人的作品至今仍被传颂。</p><h2>唐朝的对外交流</h2><p>唐朝通过丝绸之路与中亚、西亚乃至欧洲保持着密切的联系，中国的丝绸、瓷器、茶叶等商品远销海外，同时也引进了许多外来的作物和技术。</p><p>佛教在唐朝得到了进一步的发展，玄奘西行取经的故事成为千古佳话。日本、朝鲜等国家派遣大量遣唐使来华学习，将唐朝的文化制度带回本国，对东亚文化圈的形成产生了深远影响。</p><p>唐朝的文化繁荣不仅体现在文学艺术上，在科技、医学、建筑等领域也取得了显著成就，为后世留下了丰富的文化遗产。</p>",
        "state": "已发布",
        "pub_date": "2025年10月4日",
        "cover_img": ""
      },
      {
        "id": 1759714760105,
        "title": "现代人工智能技术的发展与应用",
        "cate_id": 10707,
        "cate_name": "科技",
        "content": "<h2>人工智能的发展历程</h2><p>人工智能作为一门新兴的科学技术，自20世纪50年代诞生以来，经历了多次发展高潮与低谷。从最初的符号主义人工智能，到基于规则的专家系统，再到如今的深度学习，人工智能技术不断突破原有的局限。</p><p>近年来，随着大数据、云计算和算力的提升，人工智能技术迎来了爆发式增长。深度学习算法在图像识别、自然语言处理、语音识别等领域取得了令人瞩目的成果。</p><h2>人工智能的应用领域</h2><p>在医疗领域，人工智能可以帮助医生进行疾病诊断，分析医学影像，提高诊断的准确性和效率。在金融领域，人工智能被用于风险评估、欺诈检测和智能投顾等方面。</p><p>在交通领域，自动驾驶技术正在逐步成熟，有望彻底改变我们的出行方式。在教育领域，个性化学习系统可以根据学生的学习情况提供定制化的教学内容和方法。</p><p>此外，人工智能还在智能制造、农业、安防、娱乐等多个领域发挥着重要作用，正在深刻改变着我们的生产方式和生活方式。</p><h2>人工智能的未来展望</h2><p>随着技术的不断发展，人工智能将在更多领域发挥作用，同时也面临着伦理、安全、就业等方面的挑战。我们需要在推动技术发展的同时，建立健全相关的法律法规和伦理规范。</p><p>未来，人工智能可能会与生物技术、量子计算等前沿技术相结合，产生更加革命性的突破，为人类社会带来更多的可能性。</p>",
        "state": "已发布",
        "pub_date": "2025年10月3日",
        "cover_img": ""
      },
      {
        "id": 1759714760106,
        "title": "宋代文化艺术的繁荣",
        "cate_id": 10728,
        "cate_name": "文化",
        "content": "<h2>宋代的文化成就</h2><p>宋代是中国文化发展的重要时期，在文学、艺术、哲学等领域都取得了辉煌的成就。宋词作为宋代文学的代表，与唐诗并称为中国古典文学的双璧。</p><p>苏轼、李清照、辛弃疾等词人的作品情感真挚，意境深远，至今仍被广泛传诵。宋代的话本小说也为后世白话文学的发展奠定了基础。</p><h2>宋代的绘画艺术</h2><p>宋代绘画在中国绘画史上占有重要地位，山水画、花鸟画、人物画等都达到了很高的艺术水平。范宽、郭熙、李唐等画家的作品构图严谨，笔墨精妙，意境深远。</p><p>宋代还出现了文人画这一独特的艺术形式，强调画家的个人修养和情感表达，对后世中国画的发展产生了深远影响。</p><h2>宋代的科学技术</h2><p>宋代的科学技术也十分发达，活字印刷术的发明极大地促进了文化的传播。指南针在航海中的广泛应用，促进了海外贸易的发展。</p><p>火药在军事上的使用改变了战争的方式，沈括的《梦溪笔谈》记录了许多当时的科学发现和技术成就。这些科技成果不仅推动了中国社会的发展，也对世界文明进步作出了重要贡献。</p><p>宋代的学校教育体系也较为完善，书院教育盛行，培养了大批人才，为文化的繁荣提供了人才保障。</p>",
        "state": "草稿",
        "pub_date": "2025年10月2日",
        "cover_img": ""
      },
      {
        "id": 1759714760107,
        "title": "当代国际关系的新变化",
        "cate_id": 10730,
        "cate_name": "时政",
        "content": "<h2>全球化背景下的国际关系</h2><p>随着全球化的深入发展，各国之间的相互依存程度不断加深，国际关系呈现出新的特点和趋势。经济全球化使各国经济紧密相连，形成了你中有我、我中有你的局面。</p><p>与此同时，全球性问题如气候变化、恐怖主义、传染病等需要各国共同应对，这促进了国际合作的深化。多边主义和国际组织在国际事务中发挥着越来越重要的作用。</p><h2>大国关系的调整</h2><p>当前，世界主要大国之间的关系正在经历深刻调整。美国、中国、俄罗斯、欧盟等主要力量之间的互动影响着全球格局的演变。</p><p>贸易保护主义的抬头和地缘政治竞争的加剧给国际关系带来了新的挑战。如何在竞争中找到合作的空间，维护国际体系的稳定，是各国面临的共同课题。</p><h2>新兴领域的安全挑战</h2><p>随着科技的发展，网络安全、太空安全、人工智能安全等新兴领域的安全问题日益突出。这些领域的规则和规范尚未完全建立，容易成为国际竞争的新焦点。</p><p>数据安全和隐私保护成为各国关注的焦点，网络空间的治理需要国际社会的共同努力。太空资源的开发利用也引发了关于太空治理规则的讨论。</p><p>面对这些新挑战，国际社会需要加强对话与合作，共同制定相应的规则和标准，维护这些新兴领域的安全与稳定。</p>",
        "state": "已发布",
        "pub_date": "2025年10月1日",
        "cover_img": ""
      },
      {
        "id": 1759714760108,
        "title": "中国电影产业的发展与展望",
        "cate_id": 10748,
        "cate_name": "娱乐",
        "content": "<h2>中国电影产业的发展历程</h2><p>中国电影产业经历了从无到有、从小到大的发展历程。改革开放以来，中国电影市场逐步开放，电影产量和质量不断提高。</p><p>进入21世纪，随着经济的发展和人民生活水平的提高，中国电影市场迅速扩大，已成为全球第二大电影市场。国产电影的票房和影响力不断提升，出现了一批既有艺术价值又有市场号召力的优秀作品。</p><h2>中国电影的艺术成就</h2><p>中国电影在艺术上取得了显著成就，张艺谋、陈凯歌、贾樟柯等导演的作品在国际上获得了广泛认可。这些作品不仅展现了中国文化的独特魅力，也探讨了人类共同面临的问题。</p><p>近年来，中国电影类型更加多样化，既有商业大片，也有艺术电影，满足了不同观众的需求。动画电影和技术电影的发展也为中国电影产业注入了新的活力。</p><h2>中国电影面临的挑战与机遇</h2><p>中国电影产业在发展过程中也面临着一些挑战，如创作自由度、市场竞争、人才培养等问题。同时，新媒体的发展既带来了挑战，也提供了新的发展机遇。</p><p>流媒体平台的兴起改变了观众的观影习惯，也为电影创作和发行提供了新的渠道。中国电影需要在这些变化中找到自己的定位和发展方向。</p><p>随着中国文化的国际影响力不断提升，中国电影也有更多机会走向世界，向全球观众讲述中国故事，促进文化交流与理解。</p>",
        "state": "已发布",
        "pub_date": "2025年9月30日",
        "cover_img": ""
      },
      {
        "id": 1759714760109,
        "title": "体育精神与现代社会",
        "cate_id": 10756,
        "cate_name": "体育",
        "content": "<h2>体育精神的内涵</h2><p>体育精神是体育运动的灵魂，体现了人类追求卓越、超越自我的精神追求。公平竞争、团结协作、尊重对手、永不放弃是体育精神的核心内容。</p><p>奥林匹克精神更高、更快、更强、更团结，激励着无数运动员挑战极限，创造奇迹。体育精神不仅适用于竞技场，也影响着社会生活的各个方面。</p><h2>体育对社会发展的影响</h2><p>体育在促进社会发展方面发挥着重要作用。大众体育的普及有助于提高全民健康水平，减少医疗支出，提高生活质量。</p><p>竞技体育的发展可以增强民族凝聚力，提升国家形象。大型体育赛事的举办还能带动相关产业的发展，创造就业机会，促进经济增长。</p><p>体育教育在培养青少年的团队精神、纪律观念和抗挫折能力方面具有独特价值，是素质教育的重要组成部分。</p><h2>当代体育的发展趋势</h2><p>随着科技的发展，体育与科技的融合日益深入。运动装备的改进、训练方法的科学化、比赛数据的分析等都在提高运动表现方面发挥着重要作用。</p><p>电子竞技作为新兴的体育项目，吸引了大量年轻观众，正在改变人们对体育的传统认知。体育产业的商业化程度不断提高，形成了庞大的产业链。</p><p>与此同时，体育也面临着兴奋剂、腐败、过度商业化等问题。如何在发展中保持体育的纯洁性和教育功能，是体育界需要认真思考的问题。</p>",
        "state": "草稿",
        "pub_date": "2025年9月29日",
        "cover_img": ""
      }
    ],
    createdAt: new Date().toISOString()
  }
  
  db.get('users').push(newUser).write()
  
  // 7. 返回成功响应
  sendSuccessResponse(res, '注册成功！')
})

// 自定义登录接口
server.post('/api/login', (req, res) => {
  const { username, password } = req.body
  const db = router.db
  
  // 1. 校验必需参数
  const requiredCheck = validateRequired(
    [username, password], 
    ['username', 'password']
  )
  if (!requiredCheck.isValid) {
    return sendErrorResponse(res, requiredCheck.error)
  }
  
  // 2. 校验用户名格式
  const usernameCheck = validateUsername(username)
  if (!usernameCheck.isValid) {
    return sendErrorResponse(res, {
      code: 1,
      message: '用户名格式错误'
    })
  }
  
  // 3. 校验密码格式
  const passwordCheck = validatePassword(password)
  if (!passwordCheck.isValid) {
    return sendErrorResponse(res, {
      code: 1,
      message: '密码格式错误'
    })
  }
  
  // 4. 验证登录凭据
  const loginCheck = validateLoginCredentials(db, username, password)
  if (!loginCheck.isValid) {
    return sendErrorResponse(res, loginCheck.error)
  }
  
  // 5. 生成并存储token
  const token = generateToken(username)
  userTokens.set(username, token)
  
  // 6. 返回成功响应（包含用户基本信息）
  const { password: _, ...userInfo } = loginCheck.user
  sendSuccessResponse(res, '登录成功！', { 
    token,
    user: userInfo
  })
})

// 获取用户信息接口
server.get('/my/userinfo', authenticateToken, (req, res) => {
  const db = router.db
  const { username } = req.user
  
  // 根据用户名查找用户
  const user = db.get('users').find({ username }).value()
  
  if (!user) {
    return sendErrorResponse(res, {
      code: 1,
      message: '用户不存在'
    })
  }
  
  // 返回用户信息（排除密码）
  const { password, ...userInfo } = user
  sendSuccessResponse(res, '获取用户信息成功', userInfo)
})

// 获取文章分类列表接口
server.get('/my/cate/list', authenticateToken, (req, res) => {
  const db = router.db
  const { username } = req.user
  
  // 根据用户名查找用户
  const user = db.get('users').find({ username }).value()
  
  if (!user) {
    return sendErrorResponse(res, {
      code: 1,
      message: '用户不存在'
    })
  }
  
  // 返回用户的文章分类列表，确保放在data字段中
  const cates = user.cates || []
  sendSuccessResponse(res, '获取文章分类列表成功！', { data: cates })
})

// 新增文章分类接口
server.post('/my/cate/add', authenticateToken, (req, res) => {
  const { cate_name, cate_alias } = req.body
  const db = router.db
  const { username } = req.user
  
  // 1. 校验必需参数
  const requiredCheck = validateRequired(
    [cate_name, cate_alias], 
    ['cate_name', 'cate_alias']
  )
  if (!requiredCheck.isValid) {
    return sendErrorResponse(res, requiredCheck.error)
  }
  
  // 2. 校验分类名称格式
  const cateNameCheck = validateCateName(cate_name)
  if (!cateNameCheck.isValid) {
    return sendErrorResponse(res, cateNameCheck.error)
  }
  
  // 3. 校验分类别名格式
  const cateAliasCheck = validateCateAlias(cate_alias)
  if (!cateAliasCheck.isValid) {
    return sendErrorResponse(res, cateAliasCheck.error)
  }
  
  // 4. 查找当前用户
  const user = db.get('users').find({ username }).value()
  if (!user) {
    return sendErrorResponse(res, {
      code: 1,
      message: '用户不存在'
    })
  }
  
  // 5. 检查分类名称或别名是否已存在（在当前用户的分类中）
  const existingCates = user.cates || []
  const isCateNameExists = existingCates.some(cate => cate.cate_name === cate_name)
  const isCateAliasExists = existingCates.some(cate => cate.cate_alias === cate_alias)
  
  if (isCateNameExists || isCateAliasExists) {
    return sendErrorResponse(res, {
      code: 1,
      message: '此分类已存在！'
    })
  }
  
  // 6. 创建新分类
  const newCate = {
    id: Date.now(), // 使用时间戳作为ID
    cate_name,
    cate_alias
  }
  
  // 7. 更新用户的分类列表
  db.get('users')
    .find({ username })
    .update('cates', cates => [...(cates || []), newCate])
    .write()
  
  // 8. 返回成功响应
  sendSuccessResponse(res, '新增文章分类成功！')
})

// 更新文章分类接口 - 直接通过ID查找
server.put('/my/cate/info', authenticateToken, (req, res) => {
  try {
    const { id, cate_name, cate_alias } = req.body
    const db = router.db
    const { username } = req.user
    
    console.log('收到更新请求:', { id, cate_name, cate_alias })
    
    // 1. 查找当前用户
    const user = db.get('users').find({ username }).value()
    if (!user) {
      return sendErrorResponse(res, {
        code: 1,
        message: '用户不存在'
      })
    }
    
    console.log('用户当前的分类:', user.cates)
    
    // 2. 直接通过ID查找并更新分类
    const updatedCates = user.cates.map(cate => {
      // 使用宽松比较，确保能找到对应的分类
      if (cate.id == id) {
        console.log('找到要更新的分类:', cate)
        return {
          ...cate,
          cate_name,
          cate_alias
        }
      }
      return cate
    })
    
    console.log('更新后的分类列表:', updatedCates)
    
    // 3. 保存更新后的分类列表
    db.get('users')
      .find({ username })
      .assign({ cates: updatedCates })
      .write()
    
    console.log('数据写入完成')
    
    // 4. 返回成功响应
    sendSuccessResponse(res, '更新分类信息成功！')
    
  } catch (error) {
    console.error('更新过程中出错:', error)
    sendErrorResponse(res, {
      code: 1,
      message: '更新失败，服务器错误'
    })
  }
})
// 删除文章分类接口
server.delete('/my/cate/del', authenticateToken, (req, res) => {
  const { id } = req.query
  const db = router.db
  const { username } = req.user

  // 1. 校验必需参数
  const requiredCheck = validateRequired([id], ['id'])
  if (!requiredCheck.isValid) {
    return sendErrorResponse(res, requiredCheck.error)
  }

  // 2. 校验ID格式
  const idCheck = validateId(id)
  if (!idCheck.isValid) {
    return sendErrorResponse(res, idCheck.error)
  }

  // 3. 查找当前用户
  const user = db.get('users').find({ username }).value()
  if (!user) {
    return sendErrorResponse(res, {
      code: 1,
      message: '用户不存在'
    })
  }

  // 4. 检查分类是否存在
  const existingCates = user.cates || []
  const cateIndex = existingCates.findIndex(cate => cate.id == id) // 使用宽松比较

  if (cateIndex === -1) {
    return sendErrorResponse(res, {
      code: 1,
      message: '要删除的分类不存在！'
    })
  }

  // 5. 从分类列表中删除该分类
  const updatedCates = existingCates.filter(cate => cate.id != id)

  // 6. 更新用户的分类列表
  db.get('users')
    .find({ username })
    .assign({ cates: updatedCates })
    .write()

  // 7. 返回成功响应
  sendSuccessResponse(res, '删除文章分类成功！')
})

// 获取文章列表接口
server.get('/my/article/list', authenticateToken, (req, res) => {
  const { pagenum, pagesize, cate_id, state } = req.query
  const db = router.db
  const { username } = req.user

  // 1. 校验必需参数
  const requiredCheck = validateRequired([pagenum, pagesize], ['pagenum', 'pagesize'])
  if (!requiredCheck.isValid) {
    return sendErrorResponse(res, requiredCheck.error)
  }

  // 2. 转换页码和页大小为数字
  const pageNum = parseInt(pagenum)
  const pageSize = parseInt(pagesize)
  
  if (isNaN(pageNum) || pageNum < 1) {
    return sendErrorResponse(res, {
      code: 1,
      message: '"pagenum" must be greater than or equal to 1'
    })
  }

  if (isNaN(pageSize) || pageSize < 1) {
    return sendErrorResponse(res, {
      code: 1,
      message: '"pagesize" must be greater than or equal to 1'
    })
  }

  // 3. 查找当前用户
  const user = db.get('users').find({ username }).value()
  if (!user) {
    return sendErrorResponse(res, {
      code: 1,
      message: '用户不存在'
    })
  }

  // 4. 获取用户的文章列表（如果没有就返回空数组）
  let articles = user.articles || []

  // 5. 根据查询条件筛选文章
  if (cate_id) {
    articles = articles.filter(article => article.cate_id == cate_id)
  }

  if (state) {
    articles = articles.filter(article => article.state === state)
  }

  // 6. 计算分页
  const total = articles.length
  const startIndex = (pageNum - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedArticles = articles.slice(startIndex, endIndex)

  // 7. 格式化返回数据（注意字段名映射）
  const formattedArticles = paginatedArticles.map(article => ({
    id: article.id,
    title: article.title,
    pub_date: article.pub_date,
    state: article.state,
    cate_name: article.cate_name
  }))

  // 8. 返回成功响应（使用统一的code字段）
  sendSuccessResponse(res, '获取文章列表成功！', {
    data: formattedArticles,
    total: total
  })
})

// 发布文章接口
server.post('/my/article/add', authenticateToken, upload.none(), (req, res) => {
  const { title, cate_id, content, state } = req.body
  const db = router.db
  const { username } = req.user

  console.log('收到发布文章请求:', { title, cate_id, content, state })
  console.log('cate_id 类型:', typeof cate_id)

  // 1. 校验必需参数
  const requiredCheck = validateRequired(
    [title, cate_id, content, state], 
    ['title', 'cate_id', 'content', 'state']
  )
  if (!requiredCheck.isValid) {
    return sendErrorResponse(res, requiredCheck.error)
  }

  // 2. 确保 cate_id 是数字类型
  let numericCateId;
  if (typeof cate_id === 'string') {
    numericCateId = parseInt(cate_id, 10)
    if (isNaN(numericCateId)) {
      return sendErrorResponse(res, {
        code: 1,
        message: '分类ID格式错误'
      })
    }
  } else if (typeof cate_id === 'number') {
    numericCateId = cate_id
  } else {
    return sendErrorResponse(res, {
      code: 1,
      message: '分类ID必须是数字'
    })
  }

  // 3. 校验文章标题格式
  const titleCheck = validateArticleTitle(title)
  if (!titleCheck.isValid) {
    return sendErrorResponse(res, titleCheck.error)
  }

  // 4. 校验文章状态
  const stateCheck = validateArticleState(state)
  if (!stateCheck.isValid) {
    return sendErrorResponse(res, stateCheck.error)
  }

  // 5. 校验分类ID是否存在 - 使用转换后的数字ID
  const cateIdCheck = validateCateIdExists(db, username, numericCateId)
  if (!cateIdCheck.exists) {
    return sendErrorResponse(res, cateIdCheck.error)
  }

  // 6. 查找当前用户
  const user = db.get('users').find({ username }).value()
  if (!user) {
    return sendErrorResponse(res, {
      code: 1,
      message: '用户不存在'
    })
  }

  // 7. 获取分类名称 - 使用转换后的数字ID
  const cate = user.cates.find(c => c.id == numericCateId)
  const cate_name = cate ? cate.cate_name : ''

  // 8. 创建新文章 - 使用数字类型的 cate_id
  const newArticle = {
    id: Date.now(), // 使用时间戳作为文章ID
    title,
    cate_id: numericCateId, // 确保是数字类型
    cate_name,
    content,
    state,
    pub_date: `${new Date().getFullYear()}年${new Date().getMonth() + 1}月${new Date().getDate()}日`,
    cover_img: '' // 由于mock服务器不处理文件上传，这里设为空字符串
  }

  console.log('创建新文章:', newArticle)

  // 9. 更新用户的文章列表
  const currentArticles = user.articles || []
  db.get('users')
    .find({ username })
    .assign({ 
      articles: [newArticle, ...currentArticles]
    })
    .write()

  // 10. 返回成功响应
  sendSuccessResponse(res, '发布文章成功！')
})

// 获取文章详情接口
server.get('/my/article/info', authenticateToken, (req, res) => {
  try {
    const { id } = req.query // 从query参数获取文章id
    const db = router.db
    const { username } = req.user

    console.log('收到获取文章详情请求，文章ID:', id)

    // 1. 校验必需参数
    if (!id) {
      return sendErrorResponse(res, {
        code: 2,
        message: '"id" is required'
      })
    }

    // 2. 查找当前用户
    const user = db.get('users').find({ username }).value()
    if (!user) {
      return sendErrorResponse(res, {
        code: 1,
        message: '用户不存在'
      })
    }

    // 3. 查找文章
    const articles = user.articles || []
    const article = articles.find(article => article.id == id) // 使用宽松比较

    if (!article) {
      return sendErrorResponse(res, {
        code: 1,
        message: '文章不存在！'
      })
    }

    // 4. 构建返回数据
    const articleDetail = {
      id: article.id,
      title: article.title,
      content: article.content,
      cover_img: article.cover_img || '', // 封面图片路径
      pub_date: article.pub_date,
      state: article.state,
      cate_id: article.cate_id,
      author_id: user.id, // 作者ID使用用户ID
      cate_name: article.cate_name,
      username: user.username,
      nickname: user.nickname || user.username
    }

    console.log('返回文章详情:', articleDetail)

    // 5. 返回成功响应
    sendSuccessResponse(res, '获取文章成功！', articleDetail)
    
  } catch (error) {
    console.error('获取文章详情过程中出错:', error)
    sendErrorResponse(res, {
      code: 1,
      message: '获取文章详情失败，服务器错误'
    })
  }
})

// 更新文章接口 - 使用小写id
server.put('/my/article/info', authenticateToken, upload.none(), (req, res) => {
  try {
    const { id, title, cate_id, content, state } = req.body
    const db = router.db
    const { username } = req.user

    console.log('收到更新文章请求 - 完整body:', req.body)
    console.log('文章ID:', id, '类型:', typeof id)
    console.log('cate_id:', cate_id, '类型:', typeof cate_id)

    // 1. 校验必需参数
    if (!id) {
      return sendErrorResponse(res, {
        code: 1,
        message: '文章ID不能为空'
      })
    }

    // 2. 确保 cate_id 是数字类型
    let numericCateId;
    if (typeof cate_id === 'string') {
      numericCateId = parseInt(cate_id, 10)
      if (isNaN(numericCateId)) {
        return sendErrorResponse(res, {
          code: 1,
          message: '分类ID格式错误'
        })
      }
    } else if (typeof cate_id === 'number') {
      numericCateId = cate_id
    } else {
      return sendErrorResponse(res, {
        code: 1,
        message: '分类ID必须是数字'
      })
    }

    // 3. 查找当前用户
    const user = db.get('users').find({ username }).value()
    if (!user) {
      return sendErrorResponse(res, {
        code: 1,
        message: '用户不存在'
      })
    }

    // 4. 查找要更新的文章 - 使用宽松比较确保能找到
    const articles = user.articles || []
    console.log('用户文章列表:', articles)
    
    const articleIndex = articles.findIndex(article => {
      console.log(`比较: ${article.id} (${typeof article.id}) == ${id} (${typeof id})`)
      return article.id == id // 使用宽松比较
    })

    console.log('找到的文章索引:', articleIndex)

    if (articleIndex === -1) {
      return sendErrorResponse(res, {
        code: 1,
        message: '要更新的文章不存在！'
      })
    }

    // 5. 获取分类名称 - 使用转换后的数字ID
    const cate = user.cates.find(c => c.id == numericCateId)
    const cate_name = cate ? cate.cate_name : ''

    // 6. 更新文章信息
    const updatedArticle = {
      ...articles[articleIndex], // 保留原有字段
      title,
      cate_id: numericCateId, // 使用数字类型的cate_id
      cate_name,
      content,
      state
      // 保留原有的pub_date和cover_img
    }

    console.log('更新前的文章:', articles[articleIndex])
    console.log('更新后的文章:', updatedArticle)

    // 7. 更新文章列表
    const updatedArticles = [...articles]
    updatedArticles[articleIndex] = updatedArticle

    db.get('users')
      .find({ username })
      .assign({ articles: updatedArticles })
      .write()

    console.log('文章更新成功')

    // 8. 返回成功响应
    sendSuccessResponse(res, '修改文章成功!')
    
  } catch (error) {
    console.error('更新文章过程中出错:', error)
    sendErrorResponse(res, {
      code: 1,
      message: '更新文章失败，服务器错误'
    })
  }
})

// 删除文章接口
server.delete('/my/article/info', authenticateToken, (req, res) => {
  try {
    const { id } = req.query // 从 Query 参数获取文章ID
    const db = router.db
    const { username } = req.user

    console.log('收到删除文章请求，文章ID:', id)

    // 1. 校验必需参数
    if (!id) {
      return sendErrorResponse(res, {
        code: 2,
        message: '"id" is required'
      })
    }

    // 2. 查找当前用户
    const user = db.get('users').find({ username }).value()
    if (!user) {
      return sendErrorResponse(res, {
        code: 1,
        message: '用户不存在'
      })
    }

    // 3. 查找要删除的文章
    const articles = user.articles || []
    const articleIndex = articles.findIndex(article => article.id == id) // 使用宽松比较

    console.log('找到的文章索引:', articleIndex)

    if (articleIndex === -1) {
      return sendErrorResponse(res, {
        code: 1,
        message: '要删除的文章不存在！'
      })
    }

    // 4. 从文章列表中删除该文章
    const updatedArticles = articles.filter(article => article.id != id)

    // 5. 更新用户的文章列表
    db.get('users')
      .find({ username })
      .assign({ articles: updatedArticles })
      .write()

    console.log('文章删除成功')

    // 6. 返回成功响应
    sendSuccessResponse(res, '删除文章成功！')
    
  } catch (error) {
    console.error('删除文章过程中出错:', error)
    sendErrorResponse(res, {
      code: 1,
      message: '删除文章失败，服务器错误'
    })
  }
})

// 更新用户密码接口
server.patch('/my/updatepwd', authenticateToken, (req, res) => {
  try {
    const { old_pwd, new_pwd, re_pwd } = req.body
    const db = router.db
    const { username } = req.user

    console.log('收到更新密码请求:', { old_pwd, new_pwd, re_pwd })

    // 1. 校验必需参数
    const requiredCheck = validateRequired(
      [old_pwd, new_pwd, re_pwd], 
      ['old_pwd', 'new_pwd', 're_pwd']
    )
    if (!requiredCheck.isValid) {
      return sendErrorResponse(res, requiredCheck.error)
    }

    // 2. 校验旧密码格式
    const oldPasswordCheck = validatePassword(old_pwd)
    if (!oldPasswordCheck.isValid) {
      return sendErrorResponse(res, {
        code: 1,
        message: '旧密码格式错误'
      })
    }

    // 3. 校验新密码格式
    const newPasswordCheck = validatePassword(new_pwd)
    if (!newPasswordCheck.isValid) {
      return sendErrorResponse(res, {
        code: 1,
        message: '新密码格式错误'
      })
    }

    // 4. 校验密码一致性
    const passwordMatchCheck = validatePasswordMatch(new_pwd, re_pwd)
    if (!passwordMatchCheck.isValid) {
      return sendErrorResponse(res, passwordMatchCheck.error)
    }

    // 5. 校验旧密码是否正确
    const oldPasswordValidCheck = validateOldPassword(db, username, old_pwd)
    if (!oldPasswordValidCheck.isValid) {
      return sendErrorResponse(res, oldPasswordValidCheck.error)
    }

    // 6. 更新密码
    db.get('users')
      .find({ username })
      .assign({ password: new_pwd })
      .write()

    console.log('密码更新成功')

    // 7. 返回成功响应
    sendSuccessResponse(res, '更新密码成功！')
    
  } catch (error) {
    console.error('更新密码过程中出错:', error)
    sendErrorResponse(res, {
      code: 1,
      message: '更新密码失败，服务器错误'
    })
  }
})

// 更新用户基本资料接口
server.put('/my/userinfo', authenticateToken, (req, res) => {
  try {
    const { id, nickname, email, username: newUsername, user_pic } = req.body
    const db = router.db
    const { username: currentUsername } = req.user // 当前登录用户的用户名

    console.log('收到更新用户信息请求:', { id, nickname, email, newUsername, user_pic })

    // 1. 校验必需参数
    const requiredCheck = validateRequired(
      [id, nickname, email], 
      ['id', 'nickname', 'email']
    )
    if (!requiredCheck.isValid) {
      return sendErrorResponse(res, requiredCheck.error)
    }

    // 2. 校验昵称格式
    const nicknameCheck = validateNickname(nickname)
    if (!nicknameCheck.isValid) {
      return sendErrorResponse(res, nicknameCheck.error)
    }

    // 3. 校验邮箱格式
    const emailCheck = validateEmail(email)
    if (!emailCheck.isValid) {
      return sendErrorResponse(res, emailCheck.error)
    }

    // 4. 查找当前用户
    const user = db.get('users').find({ username: currentUsername }).value()
    if (!user) {
      return sendErrorResponse(res, {
        code: 1,
        message: '用户不存在'
      })
    }

    // 5. 检查ID是否匹配
    if (user.id != id) {
      return sendErrorResponse(res, {
        code: 1,
        message: '用户ID不匹配'
      })
    }

    // 6. 检查用户名是否被占用（如果要修改用户名）
    if (newUsername && newUsername !== currentUsername) {
      const usernameExistsCheck = checkUsernameExists(db, newUsername)
      if (usernameExistsCheck.exists) {
        return sendErrorResponse(res, usernameExistsCheck.error)
      }
    }

    // 7. 更新用户信息
    const updatedUser = {
      ...user,
      nickname,
      email,
      user_pic: user_pic || '', // 如果不处理图片，设为空字符串
      // 如果要更新用户名
      ...(newUsername && newUsername !== currentUsername && { username: newUsername })
    }

    console.log('更新用户信息:', updatedUser)

    // 8. 保存更新后的用户信息
    db.get('users')
      .find({ username: currentUsername })
      .assign(updatedUser)
      .write()

    // 9. 如果用户名被修改，更新token对应的用户名
    if (newUsername && newUsername !== currentUsername) {
      const token = userTokens.get(currentUsername)
      if (token) {
        userTokens.delete(currentUsername)
        userTokens.set(newUsername, token)
      }
    }

    console.log('用户信息更新成功')

    // 10. 返回成功响应
    sendSuccessResponse(res, '修改用户信息成功！')
    
  } catch (error) {
    console.error('更新用户信息过程中出错:', error)
    sendErrorResponse(res, {
      code: 1,
      message: '更新用户信息失败，服务器错误'
    })
  }
})
// 使用默认路由
server.use(router)

// 启动服务器
const PORT = 3007
server.listen(PORT, 'localhost', () => {
  console.log(`Mock Server is running on http://localhost:${PORT}`)
  console.log('可用接口:')
  console.log('  POST /api/reg - 用户注册')
  console.log('  POST /api/login - 用户登录')
  console.log('  GET /my/userinfo - 获取用户信息（需要token）')
  console.log('  PATCH /my/updatepwd - 更新用户密码（需要token）')
  console.log('  PUT /my/userinfo - 更新用户基本资料（需要token）')
  console.log('  GET /my/cate/list - 获取文章分类列表（需要token）')
  console.log('  POST /my/cate/add - 新增文章分类（需要token）')
  console.log('  PUT /my/cate/info - 更新文章分类（需要token）')
  console.log('  DELETE /my/cate/del - 删除文章分类（需要token）')
  console.log('  GET /my/article/list - 获取文章列表（需要token）')
  console.log('  POST /my/article/add - 发布文章（需要token）')
  console.log('  PUT /my/article/info - 更新文章（需要token）')
  console.log('  GET /my/article/info - 获取文章详情（需要token）')
  console.log('  DELETE /my/article/info - 删除文章（需要token）')
})