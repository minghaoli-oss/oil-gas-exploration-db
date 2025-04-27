<template>
  <div>
    <h1>数据管理</h1>
    <div class="mb-3">
      <input type="file" @change="onFileChange" accept=".csv" class="form-control d-inline-block" style="width: 300px; margin-right: 10px;" />
      <button @click="importData" class="btn btn-primary">确认上传</button>
    </div>
    <form @submit.prevent="addData" class="mb-3">
      <input v-model="newData.name" placeholder="勘探点名称" class="form-control d-inline-block" style="width: 200px; margin-right: 10px;" />
      <input v-model="newData.location" placeholder="位置 (经纬度)" class="form-control d-inline-block" style="width: 200px; margin-right: 10px;" />
      <input v-model="newData.depth" placeholder="深度 (米)" type="number" class="form-control d-inline-block" style="width: 150px; margin-right: 10px;" />
      <input v-model="newData.porosity" placeholder="孔隙度 (%)" type="number" class="form-control d-inline-block" style="width: 150px; margin-right: 10px;" />
      <button type="submit" class="btn btn-primary">添加</button>
    </form>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>名称</th>
          <th>位置</th>
          <th>深度 (米)</th>
          <th>孔隙度 (%)</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in store.dataList" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.depth }}</td>
          <td>{{ item.porosity }}</td>
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
      newData: { name: '', location: '', depth: null, porosity: null },
      selectedFile: null
    };
  },
  methods: {
    addData() {
      if (!this.newData.name || !this.newData.location || !this.newData.depth || !this.newData.porosity) {
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
        porosity: parseFloat(this.newData.porosity),
        lng,
        lat
      });
      this.newData = { name: '', location: '', depth: null, porosity: null };
    },
    onFileChange(event) {
      this.selectedFile = event.target.files[0];
      console.log('文件已选择：', this.selectedFile ? this.selectedFile.name : '无文件');
      if (!this.selectedFile) {
        alert('请选择一个文件');
      }
    },
    importData() {
      if (!this.selectedFile) {
        alert('请先选择一个 CSV 文件');
        return;
      }
      console.log('开始读取文件：', this.selectedFile.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('文件读取完成');
        const text = e.target.result;
        console.log('原始 CSV 内容：', text);
        const rows = text.split(/\r?\n/).slice(1).filter(row => row.trim() !== '');
        console.log('解析后的行：', rows);
        
        rows.forEach((row, index) => {
          console.log(`解析第 ${index + 1} 行：`, row);
          // 使用 split 解析 CSV，保留位置字段中的逗号
          const fields = this.parseCSVRow(row);
          console.log(`第 ${index + 1} 行字段：`, fields);
          
          if (fields.length !== 4) {
            console.warn(`第 ${index + 1} 行格式错误：${row}`);
            return;
          }

          const [name, location, depth, porosity] = fields;
          console.log(`第 ${index + 1} 行数据：`, { name, location, depth, porosity });

          if (!name || !location || !depth || !porosity) {
            console.warn(`第 ${index + 1} 行数据不完整：${row}`);
            return;
          }

          const [lng, lat] = location.split(',').map(Number);
          const parsedDepth = parseFloat(depth);
          const parsedPorosity = parseFloat(porosity);

          if (isNaN(lng) || isNaN(lat) || isNaN(parsedDepth) || isNaN(parsedPorosity)) {
            console.warn(`第 ${index + 1} 行数据无效：${row}`);
            return;
          }

          this.store.addData({
            name,
            location,
            depth: parsedDepth,
            porosity: parsedPorosity,
            lng,
            lat
          });
          console.log(`第 ${index + 1} 行添加成功`);
        });

        console.log('上传后的 dataList：', this.store.dataList);
        alert('上传成功');
      };
      reader.onerror = (e) => {
        console.error('文件读取失败：', e);
        alert('文件读取失败，请检查文件格式');
      };
      reader.readAsText(this.selectedFile, 'UTF-8');
    },
    parseCSVRow(row) {
      // 查找字段分隔符，确保位置字段不被拆分
      const fields = [];
      let nameEnd = row.indexOf(',');
      if (nameEnd === -1) return fields;
      const name = row.substring(0, nameEnd).trim();
      fields.push(name);

      // 查找位置字段 (经度,纬度)
      const locationStart = nameEnd + 1;
      const depthComma = row.indexOf(',', locationStart);
      if (depthComma === -1) return fields;
      const locationEnd = row.indexOf(',', depthComma + 1);
      if (locationEnd === -1) return fields;
      const location = row.substring(locationStart, locationEnd).trim();
      fields.push(location);

      // 查找深度和孔隙度
      const depthEnd = row.lastIndexOf(',');
      if (depthEnd === locationEnd) return fields;
      const depth = row.substring(locationEnd + 1, depthEnd).trim();
      fields.push(depth);

      const porosity = row.substring(depthEnd + 1).trim();
      fields.push(porosity);

      return fields;
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
</style>