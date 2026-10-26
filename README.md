# 刘少卿 · rowan 项目履历网站

> 以交互星图串联设计、工业与编程&AI 三条主线的个人项目履历站点。

纯静态站点，无构建步骤。已按项目清单整理为 12 个独立档案：

- 设计：3D 设计（展厅设计、游戏角色设计）、2D 设计（界面与交互设计）
- 工业：电力、产品设计、嵌入式
- 编程&AI：视觉识别、项目开发

云台人脸追踪以「工业 / 嵌入式」为主分类，同时关联「编程&AI / 视觉识别」；两个入口共用同一档案，项目数量按唯一档案统计。

## 特性

- **交互星图首页**：Three.js 渲染的项目星图，支持拖拽旋转、滚轮与双指缩放、分类聚焦、项目预览；无 WebGL 的设备自动降级为 Canvas 2D 投影渲染。
- **数据驱动**：全部内容集中在 `data.js`，新增项目只需追加一条记录，导航、星图、列表页与详情页同步生成。
- **分组图集**：场地设计类项目按子项（如「分馆比赛 01–06」）分组成册，其余项目使用平铺图廊；竖版移动端截图按窄栏单独排布。
- **响应式与无障碍**：桌面与移动双套布局，含跳转链接、键盘可达对话框、图片懒加载与大图预览。

## 技术栈

| 层面 | 选型 |
| --- | --- |
| 渲染 | Three.js（星图）+ 原生 Canvas 2D（降级方案） |
| 应用 | 原生 ES Modules，无框架、无打包器 |
| 样式 | 手写 CSS，CSS 变量统一主题 |
| 图像 | WebP（统一压缩至 1920 宽）；目录封面为生成式 SVG |
| 测试 | Node.js 内置 `node --test` |

## 目录结构

```
data.js                     项目数据（唯一数据源：分类、项目字段、图集、联系方式）
app.js                      路由与页面渲染
star-map.js                 Three.js 星图场景
canvas-renderer.js          无 WebGL 时的兼容渲染
styles.css                  全站样式
index.html                  入口
assets/projects/            项目效果图（WebP）与目录封面（SVG）
start-server.mjs            本地静态服务
generate-project-covers.mjs 依据 data.js 生成目录封面 SVG
build-project-images.py     原始素材批量转 WebP 并生成图集清单
tests/                      数据完整性与归档结构测试
```

## 本地运行

```bash
node start-server.mjs   # 默认 http://localhost:8080，可用 PORT 指定端口
```

Windows 用户也可直接双击 `启动网站.bat`。

## 数据扩展

在 `data.js` 的 `projects` 数组中追加一条：

```js
project(id, title, shortTitle, en, cat, subcategory, group, summary, {
  background: '...',                 // 项目背景
  contributions: ['...'],            // 我的工作
  process: [{title, description}],   // 项目过程
  technologies: [{label, value}],    // 技术说明
  galleries: [{title, en, images: [{src, caption}]}]  // 分组图集；单组可用 images 平铺
});
```

图片放入 `assets/projects/` 后引用即可，测试会校验引用文件是否真实存在。

## 测试

```bash
npm test
```

覆盖：项目唯一性与归档数量、分类与子分类结构、图集分组与张数、图片文件存在性、联系方式字段。

## 部署

仓库根目录即站点内容，可直接用 GitHub Pages（Source: `main` / 根目录）或任意静态托管发布。

## 联系

- 邮箱：876791052@qq.com
- 微信 / 手机：13123103919
- 站酷：阿卿AH
- GitHub：[shelter-qing](https://github.com/shelter-qing)

© 2026 刘少卿 · rowan.
