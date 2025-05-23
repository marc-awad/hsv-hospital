<script setup lang="ts">
import NavBar from "./components/Organisms/NavBar.vue"
import FooterCopyright from "./components/Organisms/FooterCopyright.vue"
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <NavBar />
    <main class="flex-grow">
      <router-view />
    </main>
    <FooterCopyright />
  </div>
</template>
