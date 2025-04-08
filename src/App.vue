<template>
  <div id="app">
    <NavBar />
    <div class="container mt-4 content">
      <router-view></router-view>
    </div>
    <AppFooter />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    AppFooter
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.content {
  flex: 1 0 auto; /* 内容区域自适应高度 */
  padding-bottom: 20px; /* 确保内容不被页脚覆盖 */
}
</style>