<template>
  <div>
    <h1>查询</h1>
    <div class="search-bar">
      <input v-model="searchQuery" placeholder="输入关键词搜索（名称/位置）..." />
    </div>
    <ul class="list-group">
      <li class="list-group-item" v-for="result in filteredResults" :key="result.id">
        {{ result.name }} - {{ result.location }} - 深度: {{ result.depth }} 米
      </li>
    </ul>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStore';

export default {
  name: 'AppQuery',
  setup() {
    const store = useDataStore();
    return { store };
  },
  data() {
    return {
      searchQuery: ''
    };
  },
  computed: {
    filteredResults() {
      const query = this.searchQuery.toLowerCase();
      return this.store.dataList.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
.search-bar {
  margin-bottom: 20px;
}
.search-bar input {
  padding: 8px;
  width: 300px;
}
</style>