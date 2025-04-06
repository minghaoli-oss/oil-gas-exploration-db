<template>
  <div>
    <h1>欢迎来到全球油气勘探类比案例数据库</h1>
    <p>这是一个基于WebGIS的数据库系统，旨在为油气勘探提供类比案例的支持。</p>
    <div id="map" style="height: 400px;"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'HomePage',
  mounted() {
    const map = L.map('map').setView([0, 0], 2)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)
  }
}
</script>

<style scoped>
div {
  padding: 20px;
}
</style>