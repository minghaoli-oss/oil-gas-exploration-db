<template>
  <div>
    <h1>分析</h1>
    <button class="btn btn-success mb-3" @click="exportData">导出数据</button>
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
            data: this.store.dataList.map(item => item.depth / 1000),
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
  },
  methods: {
    exportData() {
      const data = this.store.dataList.map(item => ({
        name: item.name,
        location: item.location,
        depth: item.depth,
        reserve: item.depth / 1000
      }));
      const csvContent = ['名称,位置,深度(米),储量(亿桶)', ...data.map(item => `${item.name},${item.location},${item.depth},${item.reserve}`)].join('\n');
      const bom = '\uFEFF';
      const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'oil-gas-analysis.csv';
      link.click();
    }
  }
};
</script>

<style scoped>
div {
  padding: 20px;
}
canvas {
  width: 100% !important; /* 宽度自适应容器 */
  height: 480px !important; /* 固定高度，增加可视性 */
  margin: 20px auto;
}
</style>