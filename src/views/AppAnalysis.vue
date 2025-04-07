<template>
  <div>
    <h1>分析</h1>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import { useDataStore } from '@/stores/dataStore';

export default {
  name: 'AppAnalysis',
  setup() {
    const store = useDataStore();
    return { store };
  },
  mounted() {
    const chartElement = this.$refs.chartCanvas;
    if (chartElement) {
      const ctx = chartElement.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.store.dataList.map(item => item.name),
          datasets: [{
            label: '油气储量 (亿桶)',
            data: this.store.dataList.map(item => item.depth / 1000), // 示例：深度转换为亿桶
            backgroundColor: ['#ff6384', '#36a2eb', '#ffce56']
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    } else {
      console.error('Canvas ref not found');
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
canvas {
  max-width: 600px;
  margin: 20px auto;
}
</style>