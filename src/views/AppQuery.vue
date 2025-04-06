<template>
    <div>
      <h1>查询</h1>
      <input v-model="searchQuery" placeholder="输入关键词搜索..." />
      <ul>
        <li v-for="result in filteredResults" :key="result.id">
          {{ result.name }} - {{ result.location }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AppQuery',
    data() {
      return {
        searchQuery: '',
        results: [
          { id: 1, name: '北海油田', location: '51.5, -0.09' },
          { id: 2, name: '墨西哥湾', location: '28.5, -89.5' }
        ]
      };
    },
    computed: {
      filteredResults() {
        return this.results.filter(item =>
          item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }
    }
  };
  </script>
  
  <style scoped>
  div {
    padding: 20px;
  }
  ul {
    list-style: none;
    padding: 0;
  }
  li {
    padding: 10px 0;
  }
  </style>