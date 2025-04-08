<template>
  <div>
    <h1>欢迎来到全球油气勘探类比案例数据库</h1>
    <p>这是一个基于WebGIS的数据库系统，旨在为油气勘探提供类比案例的支持。</p>
    <div class="search-bar">
      <input v-model="searchLocation" placeholder="搜索油田名称..." @keyup.enter="searchMap" />
      <button @click="searchMap">搜索</button>
      <button @click="resetMap" class="reset-btn">恢复初始状态</button>
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
      this.map.clearMap(); // 清空现有标记
      const markers = this.store.dataList.map(item => {
        const marker = new AMap.Marker({
          position: [item.lng, item.lat],
          title: item.name,
          icon: new AMap.Icon({
            size: new AMap.Size(25, 34),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png', // 红色标记
            imageSize: new AMap.Size(25, 34)
          })
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
      this.map.setFitView(); // 适应所有标记点
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
        this.map.setZoom(5); // 放大到5级

        // 添加搜索点位的标记
        const marker = new AMap.Marker({
          position: lnglat,
          title: matchedOilField.name,
          icon: new AMap.Icon({
            size: new AMap.Size(25, 34),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png', // 红色标记
            imageSize: new AMap.Size(25, 34)
          })
        });
        const infoWindow = new AMap.InfoWindow({
          content: `<div>油气勘探点：${matchedOilField.name}<br>位置：${matchedOilField.location}<br>深度：${matchedOilField.depth}米</div>`,
          offset: new AMap.Pixel(0, -30)
        });
        marker.on('click', () => {
          infoWindow.open(this.map, marker.getPosition());
        });
        this.map.add(marker);

        // 自动打开信息框
        infoWindow.open(this.map, lnglat);
      } else {
        console.log('未找到匹配的油田：', this.searchLocation);
        alert(`未找到油田 "${this.searchLocation}"，请检查输入`);
      }
    },
    resetMap() {
      this.map.clearMap(); // 清空所有标记
      this.addMarkers(); // 重新添加初始标记
      this.searchLocation = ''; // 清空搜索框
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
  margin-right: 10px;
}
.search-bar button:hover {
  background-color: #0056b3;
}
.search-bar .reset-btn {
  background-color: #6c757d; /* 灰色按钮 */
}
.search-bar .reset-btn:hover {
  background-color: #5a6268;
}
</style>