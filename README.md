环境要求
Node.js (版本建议 16+)

npm 或 pnpm（推荐）

# 步骤一： 安装依赖 
# 在项目根目录中打开终端

方式一：使用 pnpm（推荐）

安装 pnpm（如果尚未安装）

npm install -g pnpm

安装项目依赖

pnpm install

方式二：使用 npm

npm install

启动项目
1. 启动 Mock 服务器
在启动前端项目前，需要先启动 JSON Server 来提供模拟数据：

bash
# 进入 json-server 目录
cd json-server

# 启动 Mock 服务器
node server.js
服务器启动后，你将看到类似下面的输出：

text
JSON Server is running on port 3000
注意：如果你还没有安装 Node.js，请先到 Node.js 官网 下载并安装。

2. 启动前端项目
打开新的终端窗口，在项目根目录下运行：

bash
# 使用 pnpm（推荐）
pnpm run dev

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

如有问题，请检查控制台错误信息或联系项目维护者。

