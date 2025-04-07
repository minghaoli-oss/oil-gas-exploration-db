<template>
  <div>
    <h1>欢迎来到全球油气勘探类比案例数据库</h1>
    <p>这是一个基于WebGIS的数据库系统，旨在为油气勘探提供类比案例的支持。</p>
    <div class="search-bar">
      <input v-model="searchLocation" placeholder="搜索位置..." @keyup.enter="searchMap" />
      <button @click="searchMap">搜索</button>
    </div>
    <div id="map" style="height: 500px; background-color: #f0f0f0;"></div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
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
          center: [116.397428, 39.90923], // 北京天安门
          zoom: 10
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
        this.map.setFitView();
      } catch (error) {
        console.error('地图初始化失败：', error);
      }
    },
    addMarkers() {
      const marker = new AMap.Marker({
        position: [116.397428, 39.90923],
        title: '北海油田'
      });
      this.map.add(marker);
      const infoWindow = new AMap.InfoWindow({
        content: '<div>油气勘探点：北海油田<br>深度：3000米</div>',
        offset: new AMap.Pixel(0, -30)
      });
      marker.on('click', () => {
        infoWindow.open(this.map, marker.getPosition());
      });
    },
    searchMap() {
      if (!this.searchLocation) {
        console.error('搜索内容为空');
        return;
      }
      fetch(`http://localhost:3000/amap/geocode?address=${encodeURIComponent(this.searchLocation)}`)
        .then(response => response.json())
        .then(result => {
          if (result.status === '1' && result.geocodes.length > 0) {
            const location = result.geocodes[0].location.split(',');
            const lnglat = [parseFloat(location[0]), parseFloat(location[1])];
            this.map.setCenter(lnglat);
            this.map.setZoom(10);
            const marker = new AMap.Marker({
              position: lnglat,
              title: this.searchLocation
            });
            this.map.add(marker);
          } else {
            console.error('搜索失败：', result);
          }
        })
        .catch(error => {
          console.error('地理编码请求失败：', error);
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
  background-color: #f0f0f0;
}
.search-bar {
  margin-bottom: 0px;
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