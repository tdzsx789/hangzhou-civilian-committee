# A Election Game

基于 React（CRA）实现的 1 个 Screen + 5 个 Game 端互动小游戏，6 个页面通过 WebSocket 同步阶段、倒计时和拍照步骤，适用于局域网互动展陈场景。

## 开发流程

### 1. 准备 WebSocket 服务

1. 在本仓库的 `server/` 目录下启动 Node WebSocket 服务（默认端口 5260）：
   ```bash
   cd server
   npm install
   npm start
   ```
   - 若需修改端口/GAME_COUNT，可以传入环境变量：`PORT=6000 GAME_COUNT=5 npm start`
   - 服务会接受 `game:start`、`game:photo`，并向所有客户端广播 `stage:update`、`game:ready:list`
2. 确认 WebSocket 地址，例如 `ws://localhost:5260` 或局域网 IP：`ws://192.168.1.50:5260`

### 2. 配置前端环境变量

在 `packages/A-election-game` 根目录创建 `.env`：

```
REACT_APP_ENABLE_SOCKET=true
REACT_APP_WS_URL=ws://localhost:5260
```

不想连真实服务时，把 `REACT_APP_ENABLE_SOCKET` 设为 `false`，前端会使用内置 mock。

### 3. 安装依赖并启动开发模式

```bash
cd packages/A-election-game
npm install
npm start
```

- Screen 端打开 `http://localhost:3000/screen`
- 五个参赛端分别访问 `http://localhost:3000/game/1` ~ `/game/5`
- 每个页面加载时会独立连接 `REACT_APP_WS_URL`

## 打包与部署

### 页面（Screen + Game）打包

```bash
npm run build:client
```

产物会输出到 `build/`，部署建议：

1. 将整个 `build` 目录上传到同一台静态服务器（Nginx/Node/OSS 等）。
2. 通过路由重写或直接访问构建出的 HTML，从而在不同终端打开不同路径：
   - 大屏：`https://your-host/screen`
   - 参赛端：`https://your-host/game/1` ... `game/5`
3. 每个页面在加载后会独立建立自己的 WebSocket 连接，不需要额外拆分仓库或多套代码。
4. 如果部署到不同设备，可拷贝 `build` 目录，使用 `npx serve -s build` 或任意静态服务器运行，再按上面的 URL 打开。

### 多机部署

如果需要把 6 个页面分别部署到不同的设备，只需拷贝 `build` 产物，到各自设备上用任意静态服务器（如 `serve -s build`）运行，然后通过局域网域名或 IP 访问对应页面即可。只要 `.env` 中的 `REACT_APP_WS_URL` 指向同一 WebSocket 服务端，所有终端都会保持同步。

### WebSocket 服务打包

```bash
npm run build:server
```

- `server/dist/` 会生成 `index.js` 与 `package.json`
- 将 `dist` 拷贝到部署机器后执行一次 `npm install --production`（或 `npm ci --omit=dev`）即可安装仅需的依赖
- 之后用 `node index.js`（或 PM2/systemd 等）常驻运行；如需修改端口，设置环境变量 `PORT=5260`

## WebSocket 协议约定

| 方向 | type | 描述 |
| ---- | ---- | ---- |
| Game → Server | `game:start` | 参赛端点击“开始” |
| Game → Server | `game:photo` | 参赛端完成倒计时，请求进入拍照阶段 |
| Server → All | `stage:update` | 广播阶段（`waiting/prepare/photo`） |
| Server → Screen | `game:ready:list` | 推送已准备玩家 ID 列表，供 Screen 展示 |

> 没有后端时，`REACT_APP_ENABLE_SOCKET` 默认为 `false`，`useElectionChannel` 会使用 5 秒节奏的 mock 逻辑，方便纯前端演示。

## 目录结构

```
src/
├── pages/
│   ├── Screen/   # 大屏页面
│   └── Game/     # 参赛端页面，URL 参数区分 1~5
├── hooks/
│   └── useElectionChannel.js  # WebSocket/mocking 封装
└── constants/
    └── stages.js
```

如需扩展更多阶段或消息类型，只要在 `stages.js` / `useElectionChannel.js` 内更新即可。欢迎按照现场需求继续完善。

