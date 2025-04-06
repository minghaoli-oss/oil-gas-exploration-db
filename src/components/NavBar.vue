<template>
    <nav>
      <ul>
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/data-management">数据管理</router-link></li>
        <li><router-link to="/query">查询</router-link></li>
        <li><router-link to="/analysis">分析</router-link></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar'
  }
  </script>
  
  <style scoped>
  nav {
    background-color: #333;
    color: white;
    padding: 10px;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline;
    margin-right: 10px;
  }
  a {
    color: white;
    text-decoration: none;
  }
  </style>