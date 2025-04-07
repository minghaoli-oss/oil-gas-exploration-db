import { defineStore } from 'pinia';

export const useDataStore = defineStore('data', {
  state: () => ({
    dataList: [
      { id: 1, name: '北海油田', location: '51.5, -0.09', depth: 3000, lng: 51.5, lat: -0.09 },
      { id: 2, name: '墨西哥湾', location: '28.5, -89.5', depth: 4500, lng: 28.5, lat: -89.5 },
      { id: 3, name: '南中国海油田', location: '20.0, 114.0', depth: 2000, lng: 20.0, lat: 114.0 },
      { id: 4, name: '西伯利亚油田', location: '65.0, 75.0', depth: 3500, lng: 65.0, lat: 75.0 },
      { id: 5, name: '波斯湾油田', location: '26.0, 52.0', depth: 4000, lng: 26.0, lat: 52.0 },
      { id: 6, name: '北海布伦特油田', location: '61.0, 1.0', depth: 3200, lng: 61.0, lat: 1.0 },
      { id: 7, name: '阿拉斯加油田', location: '70.0, -150.0', depth: 3800, lng: 70.0, lat: -150.0 },
      { id: 8, name: '巴西深海油田', location: '-23.0, -42.0', depth: 5000, lng: -23.0, lat: -42.0 },
      { id: 9, name: '澳大利亚西北架油田', location: '-20.0, 116.0', depth: 2500, lng: -20.0, lat: 116.0 },
      { id: 10, name: '挪威北海油田', location: '62.0, 5.0', depth: 3100, lng: 62.0, lat: 5.0 }
    ]
  }),
  actions: {
    addData(newData) {
      this.dataList.push({ ...newData, id: Date.now(), lng: parseFloat(newData.location.split(',')[0]), lat: parseFloat(newData.location.split(',')[1]) });
    },
    removeData(id) {
      this.dataList = this.dataList.filter(item => item.id !== id);
    }
  }
});