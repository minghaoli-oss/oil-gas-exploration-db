module.exports = {
  // 指定解析器
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser', // 用于解析 JavaScript 部分
    sourceType: 'module', // 支持 ES6 模块语法（import/export）
    ecmaVersion: 2020, // 支持现代 JavaScript 语法
    requireConfigFile: false // 如果没有 babel.config.js，设置为 false
  },
  // 指定环境
  env: {
    browser: true, // 支持浏览器环境（window 等全局变量）
    node: true, // 支持 Node.js 环境
    es2020: true // 支持 ES2020 语法
  },
  // 扩展推荐规则
  extends: [
    'eslint:recommended', // ESLint 推荐规则
    'plugin:vue/vue3-essential' // Vue 3 推荐规则（如果用 Vue 2，改为 'plugin:vue/essential'）
  ],
  // 启用插件
  plugins: [
    'vue' // 启用 vue 插件
  ],
  // 全局变量（之前已添加，用于高德地图 AMap）
  globals: {
    AMap: 'readonly'
  },
  // 自定义规则（可选）
  rules: {
    // 根据需要调整规则
  }
};