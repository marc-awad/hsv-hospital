<script setup lang="ts">
import NavBar from "./components/Organisms/NavBar.vue"
import FooterCopyright from "./components/Organisms/FooterCopyright.vue"
</script>

<template>
  <div>
    <NavBar />
    <main>
      <router-view />
    </main>
    <FooterCopyright />
  </div>
</template>

<style scoped></style>
