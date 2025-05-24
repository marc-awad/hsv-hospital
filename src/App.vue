<script setup lang="ts">
import NavBar from "./components/Organisms/NavBar.vue"
import FooterCopyright from "./components/Organisms/FooterCopyright.vue"
</script>

<template>
  <div class="flex flex-col min-h-screen overflow-x-hidden">
    <NavBar />
    <main class="flex-grow px-4 sm:px-6 lg:px-8">
      <router-view />
    </main>
    <FooterCopyright />
  </div>
</template>
