<template>
  <div id="app">
    <div class="topbar" v-if="currentRoute">
      <router-link to="home" tag="button">top100</router-link>
      <router-link to="search" tag="button">search</router-link>
      <router-link to="stored" tag="button">stored</router-link>
    </div>
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'App',
    computed: {
      currentRoute() {
        return this.$router.currentRoute.name !== 'youtube';
      }
    }
  }
</script>
<style lang="scss">
  .topbar {
    margin-top: 5px;
    margin-bottom: 10px;
  }
</style>
