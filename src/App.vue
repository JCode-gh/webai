<template>
  <div id="app">
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
}

.main-content {
  flex: 1;
  width: 100%;
  height: 100vh;
  overflow: auto;
}
</style>
