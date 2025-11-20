# 系统架构说明

## 架构概述

本项目采用 **Monorepo** 架构，使用 **Lerna** 作为管理工具，统一管理30个React Web展项。

## 目录结构详解

```
hangzhou-civilian-committee/
│
├── packages/                          # 所有展项的存放目录
│   ├── exhibition-01/                # 展项01（示例）
│   │   ├── public/                   # 静态资源目录
│   │   │   └── index.html            # HTML模板
│   │   ├── src/                      # 源代码目录
│   │   │   ├── index.js              # 入口文件
│   │   │   ├── App.js                # 主组件
│   │   │   ├── App.css               # 样式文件
│   │   │   └── index.css             # 全局样式
│   │   ├── package.json              # 展项依赖配置
│   │   └── build/                    # 构建输出目录（生成）
│   │
│   ├── exhibition-02/                # 展项02
│   ├── ...                           # 展项03-30
│   │
│   └── shared/                       # （可选）共享代码目录
│       ├── components/               # 公共组件
│       ├── utils/                    # 工具函数
│       └── styles/                   # 公共样式
│
├── scripts/                           # 工具脚本目录
│   └── create-exhibition.js          # 创建新展项的自动化脚本
│
├── package.json                       # 根目录配置（Lerna配置）
├── lerna.json                         # Lerna配置文件
├── .gitignore                         # Git忽略文件
├── README.md                          # 项目说明
└── ARCHITECTURE.md                    # 架构说明（本文件）
```

## 技术选型

### 核心工具

1. **Lerna** (v8.0.0+)
   - 用途：Monorepo管理工具
   - 功能：统一管理多个包，优化依赖安装，批量执行命令

2. **npm workspaces**
   - 用途：工作区管理
   - 功能：在根目录统一管理所有包的依赖

3. **Create React App**
   - 用途：React应用脚手架
   - 功能：每个展项都是独立的CRA项目

### 版本管理策略

- **独立版本**：每个展项使用独立版本号（`version: "independent"`）
- 优势：展项之间互不影响，可以独立发布和更新

## 工作流程

### 1. 初始化项目

```bash
# 1. 安装根目录依赖
npm install

# 2. 初始化所有展项依赖
npm run bootstrap
```

### 2. 创建新展项

```bash
# 使用脚本创建（推荐）
npm run new 02

# 手动创建
# 1. 复制 exhibition-01 目录
# 2. 重命名为 exhibition-02
# 3. 修改 package.json 中的名称和描述
```

### 3. 开发流程

```bash
# 方式1：运行单个展项（推荐）
cd packages/exhibition-01
npm start

# 方式2：从根目录运行单个展项
npm run start:single @hangzhou-civilian-committee/exhibition-01

# 方式3：运行所有展项（不推荐，端口冲突）
npm start
```

### 4. 构建流程

```bash
# 构建所有展项（串行，稳定）
npm run build

# 构建所有展项（并行，快速）
npm run build:all

# 构建单个展项
cd packages/exhibition-01
npm run build
```

## 依赖管理

### 依赖安装策略

1. **公共依赖**：在根目录 `package.json` 中安装
   - 例如：Lerna、构建工具等

2. **展项依赖**：在各展项的 `package.json` 中安装
   - 例如：React、业务组件等

3. **共享代码**：可以创建 `packages/shared` 包
   - 其他展项通过相对路径或包名引用

### 依赖优化

- Lerna 会自动检测并优化重复依赖
- npm workspaces 会提升公共依赖到根目录
- 减少磁盘占用和安装时间

## 端口管理

### 默认端口

- Create React App 默认使用端口 3000
- 如果多个展项同时运行，会提示端口冲突

### 解决方案

1. **修改端口**：在展项目录创建 `.env` 文件
   ```
   PORT=3001
   ```

2. **使用不同端口**：为每个展项配置不同端口
   - exhibition-01: 3000
   - exhibition-02: 3001
   - exhibition-03: 3002
   - ...

## 构建输出

### 构建目录

每个展项构建后会在其目录下生成 `build/` 文件夹：
```
packages/exhibition-01/build/
├── static/
│   ├── css/
│   ├── js/
│   └── media/
├── index.html
└── ...
```

### 部署建议

1. **独立部署**：每个展项可以独立部署到不同的服务器/路径
2. **统一部署**：可以编写部署脚本，批量部署所有展项
3. **CDN部署**：构建后的静态文件可以上传到CDN

## 扩展建议

### 1. 添加共享包

```bash
# 创建共享包
mkdir -p packages/shared
cd packages/shared
npm init -y

# 在其他展项中引用
# package.json
{
  "dependencies": {
    "@hangzhou-civilian-committee/shared": "file:../shared"
  }
}
```

### 2. 添加TypeScript支持

```bash
# 在展项中安装TypeScript
cd packages/exhibition-01
npm install --save-dev typescript @types/react @types/react-dom
```

### 3. 添加代码规范

```bash
# 根目录安装ESLint、Prettier
npm install --save-dev eslint prettier

# 创建配置文件
# .eslintrc.js
# .prettierrc
```

### 4. 添加CI/CD

可以添加 GitHub Actions 或其他CI工具：
- 自动运行测试
- 自动构建
- 自动部署

## 常见问题

### Q: 如何更新所有展项的依赖？

```bash
# 更新所有展项的React版本
lerna exec -- npm install react@latest
```

### Q: 如何删除一个展项？

```bash
# 1. 删除目录
rm -rf packages/exhibition-XX

# 2. 清理Lerna缓存（如果需要）
npm run clean
```

### Q: 如何查看所有展项？

```bash
# 列出所有包
lerna list
```

### Q: 如何运行特定展项的测试？

```bash
# 运行单个展项的测试
lerna run test --scope @hangzhou-civilian-committee/exhibition-01
```

## 性能优化

1. **并行构建**：使用 `npm run build:all` 并行构建所有展项
2. **依赖缓存**：npm workspaces 会缓存依赖，加快安装速度
3. **增量构建**：只构建修改过的展项（需要配置）

## 安全建议

1. **依赖审计**：定期运行 `npm audit` 检查安全漏洞
2. **版本锁定**：使用 `package-lock.json` 锁定依赖版本
3. **环境变量**：敏感信息使用环境变量，不要提交到代码库

