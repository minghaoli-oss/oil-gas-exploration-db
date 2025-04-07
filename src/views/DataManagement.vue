<template>
  <div>
    <h1>数据管理</h1>
    <form @submit.prevent="addData">
      <input v-model="newData.name" placeholder="勘探点名称" />
      <input v-model="newData.location" placeholder="位置 (经纬度)" />
      <input v-model="newData.depth" placeholder="深度 (米)" type="number" />
      <button type="submit">添加</button>
    </form>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>名称</th>
          <th>位置</th>
          <th>深度 (米)</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.dataList" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.depth }}</td>
          <td><button class="btn btn-danger btn-sm" @click="store.removeData(item.id)">删除</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStore';

export default {
  name: 'DataManagement',
  setup() {
    const store = useDataStore();
    return { store };
  },
  data() {
    return {
      newData: { name: '', location: '', depth: null }
    };
  },
  methods: {
    addData() {
      if (!this.newData.name || !this.newData.location || !this.newData.depth) {
        alert('请填写所有字段');
        return;
      }
      this.store.addData(this.newData);
      this.newData = { name: '', location: '', depth: null };
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
</style>