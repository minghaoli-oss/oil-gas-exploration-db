# 全球油气勘探类比案例数据库

## 简介
这是一个基于 Vue.js 和高德地图API 的 WebGIS 系统，用于管理、查询和分析油气勘探数据。

## 安装
1. 克隆仓库：`git clone <repository-url>`
2. 安装依赖：`npm install`
3. 运行项目：`npm run serve`

## 功能
- **首页**：显示 WebGIS 地图，支持标记点和位置搜索。
- **数据管理**：录入、编辑和批量导入油气数据。
- **查询**：按名称或位置搜索油气勘探数据。
- **分析**：可视化数据分析结果，支持导出。

## 依赖
- Vue 3
- 高德地图API（需要申请Key）
- Pinia（状态管理）
- Chart.js（图表）
- Bootstrap（样式）

## 注意事项
- 需要设置代理服务器以调用高德地图的地理编码API（详见 `server.js`）。
- 确保 `public/index.html` 中已正确配置高德地图API Key。