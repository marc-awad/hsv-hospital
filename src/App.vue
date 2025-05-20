<script setup lang="ts">
import { ref } from "vue"
import NavBar from "./components/Organisms/NavBar.vue"
</script>

<template>
  <div>
    <NavBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped></style>
