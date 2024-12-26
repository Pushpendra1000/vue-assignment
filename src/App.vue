<template>
  <div id="app" style="background: whitesmoke;">
    <GraphComponent />
  </div>
</template>

<script>
import GraphComponent from "./components/GraphComponent.vue";

export default {
  name: "App",
  components: {
    GraphComponent,
  },
};
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
.force-graph-container canvas {
  width: 100vw;
  height: 100vh;
}
</style>
