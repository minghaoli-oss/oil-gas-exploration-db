<template>
  <div>
    <h1>数据管理</h1>
    <div class="mb-3">
      <input type="file" @change="onFileChange" accept=".csv" class="form-control d-inline-block" style="width: 400px; margin-right: 10px;" />
      <button @click="importData" class="btn btn-primary">确认上传</button>
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
      newData: { name: '', location: '', depth: null },
      selectedFile: null // 存储选择的文件
    };
  },
  methods: {
    addData() {
      if (!this.newData.name || !this.newData.location || !this.newData.depth) {
        alert('请填写所有字段');
        return;
      }
      const [lng, lat] = this.newData.location.split(',').map(Number);
      if (isNaN(lng) || isNaN(lat)) {
        alert('经纬度格式错误，请输入有效的经度和纬度（格式：经度,纬度）');
        return;
      }
      this.store.addData({
        name: this.newData.name,
        location: this.newData.location,
        depth: parseFloat(this.newData.depth),
        lng,
        lat
      });
      this.newData = { name: '', location: '', depth: null };
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (!this.selectedFile) {
        alert('请选择一个文件');
      }
    },
    importData() {
      if (!this.selectedFile) {
        alert('请先选择一个 CSV 文件');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        console.log('原始 CSV 内容：', text);
        const rows = text.split(/\r?\n/).slice(1).filter(row => row.trim() !== '');
        console.log('解析后的行：', rows);
        rows.forEach((row, index) => {
          // 手动拆分：名称,位置,深度
          const firstCommaIndex = row.indexOf(',');
          const lastCommaIndex = row.lastIndexOf(',');
          if (firstCommaIndex === -1 || lastCommaIndex === -1 || firstCommaIndex === lastCommaIndex) {
            console.warn(`第 ${index + 1} 行格式错误：${row}`);
            return;
          }
          const name = row.substring(0, firstCommaIndex).trim();
          const depth = row.substring(lastCommaIndex + 1).trim();
          const location = row.substring(firstCommaIndex + 1, lastCommaIndex).trim();
          console.log(`第 ${index + 1} 行数据：`, { name, location, depth });
          if (!name || !location || !depth) {
            console.warn(`第 ${index + 1} 行数据不完整：${row}`);
            return;
          }
          const [lng, lat] = location.split(',').map(Number);
          if (isNaN(lng) || isNaN(lat) || isNaN(parseFloat(depth))) {
            console.warn(`第 ${index + 1} 行数据无效：${row}`);
            return;
          }
          this.store.addData({
            name,
            location,
            depth: parseFloat(depth),
            lng,
            lat
          });
        });
        console.log('上传后的 dataList：', this.store.dataList);
      };
      reader.readAsText(this.selectedFile, 'UTF-8');
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
</style>