<template>
  <div>
    <h1>欢迎来到全球油气勘探类比案例数据库</h1>
    <p>这是一个基于WebGIS的数据库系统，旨在为油气勘探提供类比案例的支持。</p>
    <input v-model="searchLocation" placeholder="搜索位置..." @keyup.enter="searchMap" />
    <div id="map" style="height: 400px;"></div>
  </div>
</template>

<script>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'HomePage',
  data() {
    return {
      searchLocation: '',
      map: null
    };
  },
  mounted() {
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // 示例：添加勘探地点标记
    L.marker([51.5, -0.09])
      .addTo(this.map)
      .bindPopup('油气勘探点：北海油田<br>深度：3000米')
      .openPopup();
  },
  methods: {
    searchMap() {
      // 这里可以调用地理编码服务（如 OpenStreetMap Nominatim）定位搜索结果
      console.log('搜索位置：', this.searchLocation);
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
</style>