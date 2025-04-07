import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
  state: () => ({
    dataList: [
      { id: 1, name: '北海油田', location: '51.5, -0.09', depth: 3000 },
      { id: 2, name: '墨西哥湾', location: '28.5, -89.5', depth: 4500 }
    ]
  }),
  actions: {
    addData(newData) {
      this.dataList.push({ ...newData, id: Date.now() });
    },
    removeData(id) {
      this.dataList = this.dataList.filter(item => item.id !== id);
    }
  }
});