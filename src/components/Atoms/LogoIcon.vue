<script setup lang="ts">
import { useRouter } from "vue-router"
const router = useRouter()

function goHome() {
  router.push("/")
}
</script>

<template>
  <div
    @click="goHome"
    class="w-[36px] h-[44px] bg-[var(--color-primary)] rounded-[8px] flex items-center justify-center text-white font-bold cursor-pointer text-[1.5rem]"
    aria-label="Accueil"
  >
    H
  </div>
</template>
