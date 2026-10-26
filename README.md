# 刘少卿 · rowan 项目履历网站

已按本人提供的项目清单整理为 12 个独立项目档案。

- 设计：3D设计（展厅设计、游戏角色设计）、2D设计（界面与交互设计）。
- 工业：电力、产品设计、嵌入式。
- 编程&AI：视觉识别、项目开发。

云台人脸追踪项目以“工业 / 嵌入式”为主分类，同时关联“编程&AI / 视觉识别”。两个入口共用相同项目 ID，全部项目数量按唯一档案统计，分类数量包含关联项目。

## 内容数据

编辑 `dist/data.js`。项目标题与简要范围来自本人提供的清单；未提供的日期、职责、过程、技术、结果、图片和视频保持空白。

每个项目可补充：

- `period`、`year`、`role`：时间与角色。
- `background`、`contributions`：背景与本人具体职责。
- `process`：`[{title,description}]` 形式的过程。
- `technologies`：`[{label,value}]` 形式的工具与技术。
- `images`：`[{src,caption}]` 形式的真实项目图。
- `video`：真实项目视频路径。
- `sources`：`[{label,url}]` 形式的文档或网页来源。

当前图为明确标注的项目目录封面，不作为项目实际成果。`generate-assets.mjs` / `generate-project-covers.mjs` 仅用于生成这些目录封面，不生成或声称真实项目成果。

姓名与联系方式位于 `profile` 对象，中文名为“刘少卿”，英文名为小写“rowan”。电话、微信和社交主页沿用待补充状态。

## 本地运行

Node.js 20 或以上版本：在项目根目录执行 `npm start`，打开 http://localhost:8080。Windows 也可双击 `启动网站.bat`。无需安装依赖。请使用本地服务器，不要直接双击 HTML。

## 页面与交互

静态 HTML/CSS/ES modules，无构建步骤。发布目录为 `dist/`。

分类路由：`#/work/design/3d`、`#/work/industrial/power`、`#/work/code/vision` 等。

项目路由含 `from` 参数，确保跨分类进入详情后仍返回原分类。搜索支持标题、地点与分类。

Three.js 星图有 3 个主分类、7 个子分类、12 个项目节点。输入灵敏度为原版的 1.5 倍（拖拽、滚轮、双指、缩放按钮），缓动按帧间隔计算；取消原来的 30 FPS 上限。无 WebGL 设备使用同一套 Three.js 场景投影的 Canvas 兼容渲染。

## 验证

运行 `node --test tests/portfolio.test.mjs` 检查唯一项目与跨类索引等内容约束。桌面和手机布局使用浏览器实测；QA 浏览器禁用 WebGL，因此原生 WebGL 分支仍未实测。

## 许可

Three.js r170：MIT。DM Sans 与 Space Grotesk：SIL Open Font License。许可文本位于 `dist/assets/`。
