<template>
    <div>
      <h1>数据管理</h1>
      <form @submit.prevent="addData">
        <input v-model="newData.name" placeholder="勘探点名称" />
        <input v-model="newData.location" placeholder="位置 (经纬度)" />
        <button type="submit">添加</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>名称</th>
            <th>位置</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataList" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.location }}</td>
            <td><button @click="removeData(item.id)">删除</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DataManagement',
    data() {
      return {
        newData: { name: '', location: '' },
        dataList: []
      };
    },
    methods: {
      addData() {
        this.dataList.push({ ...this.newData, id: Date.now() });
        this.newData = { name: '', location: '' };
      },
      removeData(id) {
        this.dataList = this.dataList.filter(item => item.id !== id);
      }
    }
  };
  </script>
  
  <style scoped>
  div {
    padding: 20px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  </style>