VUE3-BIG-E 项目
这是一个基于 Vue 3 构建的项目，集成了 Axios、Element Plus、富文本编辑器等常用依赖。

项目结构
text
VUE3-BIG-E/
├── .vscode/                 # VSCode 配置
├── json-server/             # Mock 数据服务器
├── node_modules/            # 依赖包（已存在）
├── public/                  # 静态资源
├── src/                     # 源代码
├── uploads/                 # 上传文件目录
├── README.md                # 项目说明
└── 其他配置文件...
环境要求
需先下载Node.js (版本建议 16+)

npm 或 pnpm（推荐）

安装依赖
方式一：使用 pnpm（推荐）
bash
# 安装 pnpm（如果尚未安装）
npm install -g pnpm

# 安装项目依赖
pnpm install
方式二：使用 npm
bash
npm install
启动项目
1. 启动 Mock 服务器
在启动前端项目前，需要先启动 JSON Server 来提供模拟数据：

bash
# 进入 json-server 目录
cd json-server

# 启动 Mock 服务器
node server
服务器启动后，你将看到类似下面的输出：

Mock Server is running on http://localhost:3007
可用接口:
  POST /api/reg - 用户注册
  POST /api/login - 用户登录
  GET /my/userinfo - 获取用户信息（需要token）
  PATCH /my/updatepwd - 更新用户密码（需要token）
  PUT /my/userinfo - 更新用户基本资料（需要token）
  GET /my/cate/list - 获取文章分类列表（需要token）
  POST /my/cate/add - 新增文章分类（需要token）
  PUT /my/cate/info - 更新文章分类（需要token）
  DELETE /my/cate/del - 删除文章分类（需要token）
  GET /my/article/list - 获取文章列表（需要token）
  POST /my/article/add - 发布文章（需要token）
  PUT /my/article/info - 更新文章（需要token）
  GET /my/article/info - 获取文章详情（需要token）
  DELETE /my/article/info - 删除文章（需要token）

注意：如果你还没有安装 Node.js，请先到 Node.js 官网 下载并安装。
node官网地址：
https://nodejs.org/zh-cn/download
2. 启动前端项目
打开新的终端窗口，在项目根目录下运行：

bash
# 使用 pnpm（推荐）
pnpm dev

# 或使用 npm
npm run dev
项目启动后，终端会显示访问地址，通常是：

text
http://localhost:5173
在浏览器中打开该地址即可访问应用。

主要功能特性
✅ Vue 3 + Vite 构建

✅ Element Plus UI 组件库

✅ Axios HTTP 请求库

✅ 富文本编辑器集成

✅ JSON Server Mock 数据

✅ ESLint + Prettier 代码规范

开发脚本
bash
# 开发模式
pnpm run dev

# 生产构建
pnpm run build

# 预览生产构建
pnpm run preview

# 代码检查
pnpm run lint
注意事项
确保在启动前端项目前，Mock 服务器已经正常运行

建议使用 pnpm 以获得更快的依赖安装和启动速度

如有端口冲突，可在配置文件中修改端口号

如有问题，请检查控制台错误信息或联系项目我。

