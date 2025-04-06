<template>
  <div>
    <h1>欢迎来到全球油气勘探类比案例数据库</h1>
    <p>这是一个基于WebGIS的数据库系统，旨在为油气勘探提供类比案例的支持。</p>
    <input v-model="searchLocation" placeholder="搜索位置..." @keyup.enter="searchMap" />
    <div id="map" style="height: 500px;"></div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      searchLocation: '', // 搜索框输入内容
      map: null, // 高德地图实例
      geocoder: null // 地理编码服务实例
    };
  },
  mounted() {
    // 初始化高德地图
    this.initMap();
    // 添加示例标记点
    this.addMarkers();
    // 初始化地理编码服务
    this.initGeocoder();
  },
  beforeUnmount() {
    // 组件销毁时清理地图实例
    if (this.map) {
      this.map.destroy();
      this.map = null;
    }
  },
  methods: {
    initMap() {
      // 初始化地图，中心点设置为全球中心（0, 0），缩放级别为 2
      this.map = new AMap.Map('map', {
        center: [0, 0], // 初始中心点
        zoom: 2 // 缩放级别
      });

      // 添加地图控件（例如缩放控件）
      this.map.plugin(['AMap.ControlBar'], () => {
        const controlBar = new AMap.ControlBar();
        this.map.addControl(controlBar);
      });
    },
    addMarkers() {
      // 示例：添加油气勘探点的标记
      const marker = new AMap.Marker({
        position: [51.5, -0.09], // 北海油田的经纬度
        title: '北海油田'
      });
      this.map.add(marker);

      // 添加信息窗体
      const infoWindow = new AMap.InfoWindow({
        content: '<div>油气勘探点：北海油田<br>深度：3000米</div>',
        offset: new AMap.Pixel(0, -30)
      });

      // 点击标记时打开信息窗体
      marker.on('click', () => {
        infoWindow.open(this.map, marker.getPosition());
      });
    },
    initGeocoder() {
      // 加载地理编码插件
      this.map.plugin(['AMap.Geocoder'], () => {
        this.geocoder = new AMap.Geocoder({
          // 可选配置，例如城市范围
          city: '全国'
        });
      });
    },
    searchMap() {
      if (!this.geocoder || !this.searchLocation) {
        console.error('地理编码服务未加载或搜索内容为空');
        return;
      }

      // 使用地理编码服务搜索位置
      this.geocoder.getLocation(this.searchLocation, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          const location = result.geocodes[0].location;
          const lnglat = [location.lng, location.lat];

          // 将地图中心移动到搜索结果位置
          this.map.setCenter(lnglat);
          this.map.setZoom(10);

          // 添加一个标记点
          const marker = new AMap.Marker({
            position: lnglat,
            title: this.searchLocation
          });
          this.map.add(marker);
        } else {
          console.error('搜索失败：', result);
        }
      });
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
  
}
</style>