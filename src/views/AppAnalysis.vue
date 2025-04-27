<template>
  <div>
    <h1>分析</h1>
    <button class="btn btn-success mb-3" @click="exportData">导出数据</button>

    <!-- 油气储量柱状图 -->
    <h2>油气储量对比图</h2>
    <div class="chart-container">
      <canvas ref="reserveChartCanvas"></canvas>
    </div>

    <!-- 孔隙度柱状图 -->
    <h2>孔隙度对比图</h2>
    <div class="chart-container">
      <canvas ref="porosityChartCanvas"></canvas>
    </div>
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
  data() {
    return {
      reserveChartInstance: null,
      porosityChartInstance: null,
      isChartReady: false
    };
  },
  mounted() {
    setTimeout(() => {
      this.initCharts();
    }, 100);
  },
  beforeUnmount() {
    this.destroyCharts();
  },
  watch: {
    'store.dataList': {
      handler() {
        this.updateCharts();
      },
      deep: true
    }
  },
  methods: {
    initCharts() {
      this.isChartReady = true;
      this.initReserveChart();
      this.initPorosityChart();
    },
    initReserveChart() {
      const chartElement = this.$refs.reserveChartCanvas;
      console.log('Reserve chart canvas:', chartElement);
      if (chartElement) {
        const ctx = chartElement.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          this.reserveChartInstance = new Chart(ctx, {
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
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: '油气储量 (亿桶)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: '油田名称'
                  }
                }
              }
            }
          });
          console.log('Reserve chart initialized');
        } else {
          console.error('Reserve chart context not found');
        }
      } else {
        console.error('Reserve chart canvas ref not found');
      }
    },
    initPorosityChart() {
      const chartElement = this.$refs.porosityChartCanvas;
      console.log('Porosity chart canvas:', chartElement);
      if (chartElement) {
        const ctx = chartElement.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          this.porosityChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: this.store.dataList.map(item => item.name),
              datasets: [{
                label: '孔隙度 (%)',
                data: this.store.dataList.map(item => item.porosity || 0),
                backgroundColor: '#007bff'
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: '孔隙度 (%)'
                  },
                  max: 30
                },
                x: {
                  title: {
                    display: true,
                    text: '油田名称'
                  }
                }
              }
            }
          });
          console.log('Porosity chart initialized');
        } else {
          console.error('Porosity chart context not found');
        }
      } else {
        console.error('Porosity chart canvas ref not found');
      }
    },
    updateCharts() {
      if (!this.isChartReady) return;
      if (this.reserveChartInstance) {
        this.reserveChartInstance.data.labels = this.store.dataList.map(item => item.name);
        this.reserveChartInstance.data.datasets[0].data = this.store.dataList.map(item => item.depth / 1000);
        this.reserveChartInstance.update();
      }
      if (this.porosityChartInstance) {
        this.porosityChartInstance.data.labels = this.store.dataList.map(item => item.name);
        this.porosityChartInstance.data.datasets[0].data = this.store.dataList.map(item => item.porosity || 0);
        this.porosityChartInstance.update();
      }
    },
    destroyCharts() {
      if (this.reserveChartInstance) {
        this.reserveChartInstance.destroy();
        this.reserveChartInstance = null;
      }
      if (this.porosityChartInstance) {
        this.porosityChartInstance.destroy();
        this.porosityChartInstance = null;
      }
      this.isChartReady = false;
    },
    exportData() {
      const data = this.store.dataList.map(item => ({
        name: item.name,
        location: item.location,
        depth: item.depth,
        porosity: item.porosity,
        reserve: item.depth / 1000
      }));
      const csvContent = [
        '名称,位置,深度(米),孔隙度(%),储量(亿桶)',
        ...data.map(item => `${item.name},${item.location},${item.depth},${item.porosity},${item.reserve}`)
      ].join('\n');
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
.chart-container {
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 20px auto;
}
canvas {
  width: 100% !important;
  height: 100% !important;
}
h2 {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>