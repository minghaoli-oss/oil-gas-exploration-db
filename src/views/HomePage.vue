<template>
  <div>
    <h1>欢迎来到全球油气勘探类比案例数据库</h1>
    <p>这是一个基于WebGIS的数据库系统，旨在为油气勘探提供类比案例的支持。</p>
    <div class="search-bar">
      <input v-model="searchLocation" placeholder="搜索油田名称..." @keyup.enter="searchMap" />
      <button @click="searchMap">搜索</button>
    </div>
    <div id="map" style="height: 500px; background-color: #f0f0f0;"></div>
  </div>
</template>

<script>
import { useDataStore } from '@/stores/dataStore';

export default {
  name: 'HomePage',
  setup() {
    const store = useDataStore();
    return { store };
  },
  data() {
    return {
      searchLocation: '',
      map: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initMap();
      this.addMarkers();
    });
  },
  beforeUnmount() {
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  },
  methods: {
    initMap() {
      try {
        console.log('AMap 是否可用：', typeof AMap);
        this.map = new AMap.Map('map', {
          center: [116.397428, 39.90923], // 默认中心点
          zoom: 2 // 初始缩放级别
        });
        this.map.plugin(['AMap.ControlBar'], () => {
          const controlBar = new AMap.ControlBar();
          this.map.addControl(controlBar);
        });
        this.map.on('complete', () => {
          console.log('地图加载完成');
        });
        this.map.on('error', (e) => {
          console.error('地图加载错误：', e);
        });
      } catch (error) {
        console.error('地图初始化失败：', error);
      }
    },
    addMarkers() {
      const markers = this.store.dataList.map(item => {
        const marker = new AMap.Marker({
          position: [item.lng, item.lat],
          title: item.name
        });
        const infoWindow = new AMap.InfoWindow({
          content: `<div>油气勘探点：${item.name}<br>位置：${item.location}<br>深度：${item.depth}米</div>`,
          offset: new AMap.Pixel(0, -30)
        });
        marker.on('click', () => {
          infoWindow.open(this.map, marker.getPosition());
        });
        return marker;
      });
      this.map.add(markers);
      this.map.setFitView();
    },
    searchMap() {
      if (!this.searchLocation) {
        console.error('搜索内容为空');
        alert('请输入油田名称');
        return;
      }

      const query = this.searchLocation.toLowerCase();
      const matchedOilField = this.store.dataList.find(item =>
        item.name.toLowerCase().includes(query)
      );

      if (matchedOilField) {
        const lnglat = [matchedOilField.lng, matchedOilField.lat];
        console.log('找到匹配油田：', matchedOilField.name, lnglat);
        this.map.setCenter(lnglat); // 设置地图中心
        this.map.setZoom(4); 
        const marker = new AMap.Marker({
          position: lnglat,
          title: matchedOilField.name
        });
        this.map.add(marker);
      } else {
        console.log('未找到匹配的油田：', this.searchLocation);
        alert(`未找到油田 "${this.searchLocation}"，请检查输入`);
      }
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
#map {
  width: 100%;
  height: 500px;
  background-color: #f0f0f0;
}
.search-bar {
  margin-bottom: 20px;
}
.search-bar input {
  padding: 8px;
  margin-right: 10px;
  width: 300px;
}
.search-bar button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.search-bar button:hover {
  background-color: #0056b3;
}
</style>