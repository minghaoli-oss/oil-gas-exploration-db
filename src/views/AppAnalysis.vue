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

    <!-- 储层类型饼图 -->
    <h2>储层类型分布比例</h2>
    <div class="chart-container">
      <canvas ref="reservoirTypeChartCanvas"></canvas>
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
      reservoirTypeChartInstance: null,
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
    // 推断储层类型
    inferReservoirType(oilfield) {
      const name = oilfield.name.toLowerCase();
      const porosity = oilfield.porosity || 0;

      if (name.includes('ghawar')) {
        return '碳酸盐岩';
      } else if (name.includes('permian')) {
        return '页岩';
      } else if (name.includes('brent')) {
        return '砂岩';
      } else {
        // 根据孔隙度推断
        if (porosity > 12) {
          return '砂岩';
        } else if (porosity >= 6 && porosity <= 12) {
          return '碳酸盐岩';
        } else {
          return '页岩';
        }
      }
    },
    // 计算储层类型比例
    calculateReservoirTypeRatios() {
      const totalOilfields = this.store.dataList.length;
      if (totalOilfields === 0) {
        return { carbonate: 0, shale: 0, sandstone: 0 };
      }

      let carbonateCount = 0;
      let shaleCount = 0;
      let sandstoneCount = 0;

      this.store.dataList.forEach(oilfield => {
        const type = this.inferReservoirType(oilfield);
        if (type === '碳酸盐岩') {
          carbonateCount++;
        } else if (type === '页岩') {
          shaleCount++;
        } else if (type === '砂岩') {
          sandstoneCount++;
        }
      });

      return {
        carbonate: (carbonateCount / totalOilfields) * 100,
        shale: (shaleCount / totalOilfields) * 100,
        sandstone: (sandstoneCount / totalOilfields) * 100
      };
    },
    initCharts() {
      this.isChartReady = true;
      this.initReserveChart();
      this.initPorosityChart();
      this.initReservoirTypeChart();
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
    initReservoirTypeChart() {
      const chartElement = this.$refs.reservoirTypeChartCanvas;
      console.log('Reservoir type chart canvas:', chartElement);
      if (chartElement) {
        const ctx = chartElement.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const ratios = this.calculateReservoirTypeRatios();
          this.reservoirTypeChartInstance = new Chart(ctx, {
            type: 'pie',
            data: {
              labels: ['碳酸盐岩', '页岩', '砂岩'],
              datasets: [{
                label: '储层类型分布',
                data: [ratios.carbonate, ratios.shale, ratios.sandstone],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56'],
                borderColor: ['#ffffff', '#ffffff', '#ffffff'],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    font: {
                      size: 14
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      return `${label}: ${value.toFixed(1)}%`;
                    }
                  }
                }
              }
            }
          });
          console.log('Reservoir type chart initialized');
        } else {
          console.error('Reservoir type chart context not found');
        }
      } else {
        console.error('Reservoir type chart canvas ref not found');
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
      if (this.reservoirTypeChartInstance) {
        const ratios = this.calculateReservoirTypeRatios();
        this.reservoirTypeChartInstance.data.datasets[0].data = [ratios.carbonate, ratios.shale, ratios.sandstone];
        this.reservoirTypeChartInstance.update();
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
      if (this.reservoirTypeChartInstance) {
        this.reservoirTypeChartInstance.destroy();
        this.reservoirTypeChartInstance = null;
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