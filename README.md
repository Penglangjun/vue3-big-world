🚀 VUE3-BIG-WORLD 项目说明
这是一个基于 Vue 3 + Vite 构建的后台管理系统，集成了常用开发工具和组件库，适合学习和快速开发中小型项目。

📁 项目结构
代码
VUE3-BIG-E/
├── .vscode/           # VSCode 编辑器配置
├── json-server/       # Mock 数据服务器
├── node_modules/      # 项目依赖（自动生成）
├── public/            # 静态资源目录
├── src/               # 核心源代码
├── uploads/           # 上传文件存储目录
├── README.md          # 项目说明文档
└── 其他配置文件        # 包括 vite.config.js、.eslintrc 等
⚙️ 环境要求
✅ Node.js ≥ 16（下载 Node.js）

✅ 包管理工具：推荐使用 pnpm

📦 安装依赖
使用 pnpm（推荐）
bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
使用 npm
bash
npm install
🧪 启动项目
1️⃣ 启动 Mock 数据服务器
bash
cd json-server
node server
启动成功后，你将看到：

代码
Mock Server is running on http://localhost:3007
可用接口一览（需携带 token）：
接口路径	功能说明
POST /api/reg	用户注册
POST /api/login	用户登录
GET /my/userinfo	获取用户信息
PATCH /my/updatepwd	更新用户密码
PUT /my/userinfo	更新用户资料
GET /my/cate/list	获取文章分类
POST /my/cate/add	新增分类
PUT /my/cate/info	更新分类
DELETE /my/cate/del	删除分类
GET /my/article/list	获取文章列表
POST /my/article/add	发布文章
PUT /my/article/info	更新文章
GET /my/article/info	获取文章详情
DELETE /my/article/info	删除文章
2️⃣ 启动前端项目
在项目根目录下运行：

bash
# 使用 pnpm（推荐）
pnpm dev

# 或使用 npm
npm run dev
默认访问地址：

代码
http://localhost:5173
✨ 项目特性
✅ Vue 3 + Vite 极速开发体验

✅ Element Plus UI 组件库

✅ Axios 封装的 HTTP 请求模块

✅ 富文本编辑器集成

✅ JSON Server 模拟后端数据

✅ ESLint + Prettier 统一代码规范

🔧 常用开发脚本
bash
# 启动开发环境
pnpm run dev

# 构建生产环境
pnpm run build

# 本地预览构建结果
pnpm run preview

# 代码规范检查
pnpm run lint
📝 注意事项
启动前端项目前，请确保 Mock 服务器已运行。

推荐使用 pnpm 以获得更快的依赖安装和构建速度。

如遇端口冲突，可在 vite.config.js 中修改默认端口。

如遇问题，请查看浏览器控制台或终端输出的错误信息。