<template>
  <div>
    <h1>数据管理</h1>
    <div class="mb-3">
      <input type="file" @change="importData" accept=".csv" class="form-control" />
    </div>
    <form @submit.prevent="addData" class="mb-3">
      <input v-model="newData.name" placeholder="勘探点名称" class="form-control d-inline-block" style="width: 200px; margin-right: 10px;" />
      <input v-model="newData.location" placeholder="位置 (经纬度)" class="form-control d-inline-block" style="width: 200px; margin-right: 10px;" />
      <input v-model="newData.depth" placeholder="深度 (米)" type="number" class="form-control d-inline-block" style="width: 150px; margin-right: 10px;" />
      <button type="submit" class="btn btn-primary">添加</button>
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
    },
    importData(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').slice(1); // 跳过表头
        rows.forEach(row => {
          const [name, location, depth] = row.split(',');
          if (name && location && depth) {
            this.store.addData({
              name: name.trim(),
              location: location.trim(),
              depth: parseFloat(depth.trim())
            });
          }
        });
      };
      reader.readAsText(file);
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
</style>