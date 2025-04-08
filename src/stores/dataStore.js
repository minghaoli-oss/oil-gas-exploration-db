import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
  state: () => ({
    dataList: [
      { id: 1, name: '北海油田', location: '51.5, -0.09', depth: 3000, lng: -0.09, lat: 51.5 },
      { id: 2, name: '墨西哥湾', location: '28.5, -89.5', depth: 4500, lng: -89.5, lat: 28.5 },
      { id: 3, name: '南中国海油田', location: '20.0, 114.0', depth: 2000, lng: 114.0, lat: 20.0 },
      { id: 4, name: '西伯利亚油田', location: '65.0, 75.0', depth: 3500, lng: 75.0, lat: 65.0 },
      { id: 5, name: '波斯湾油田', location: '26.0, 52.0', depth: 4000, lng: 52.0, lat: 26.0 },
      { id: 6, name: '北海布伦特油田', location: '61.0, 1.0', depth: 3200, lng: 1.0, lat: 61.0 },
      { id: 7, name: '阿拉斯加油田', location: '70.0, -150.0', depth: 3800, lng: -150.0, lat: 70.0 },
      { id: 8, name: '巴西深海油田', location: '-23.0, -42.0', depth: 5000, lng: -42.0, lat: -23.0 },
      { id: 9, name: '澳大利亚西北架油田', location: '-20.0, 116.0', depth: 2500, lng: 116.0, lat: -20.0 },
      { id: 10, name: '挪威北海油田', location: '62.0, 5.0', depth: 3100, lng: 5.0, lat: 62.0 }
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