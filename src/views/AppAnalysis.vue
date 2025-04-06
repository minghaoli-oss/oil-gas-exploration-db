<template>
    <div>
      <h1>分析</h1>
      <canvas ref="chartCanvas"></canvas>
    </div>
  </template>
  
  <script>
  import Chart from 'chart.js/auto'; // 确保正确导入 Chart.js
  
  export default {
    name: 'AppAnalysis',
    mounted() {
      const chartElement = this.$refs.chartCanvas;
      if (chartElement) {
        const ctx = chartElement.getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['北海油田', '墨西哥湾', '南中国海'],
                datasets: [{
                label: '油气储量 (亿桶)',
                data: [12, 19, 8],
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

