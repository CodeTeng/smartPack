<template>
  <main class="app-wrapper">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <router-view :key="key" />
      </transition>
    </section>
  </main>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  padding: 0 20px;
}

.app-main {
  /*50 = navbar  */
  height: calc(100vh - 80px);
  width: 100%;
  position: relative;
  overflow-y: auto;
  background-color: #fff;
  padding: 20px 20px 0;
}
</style>
