<script setup lang="ts">
import LogoIcon from "../Atoms/LogoIcon.vue"
import PageTitle from "../Atoms/PageTitle.vue"

const props = defineProps<{ text: string }>()
</script>

<template>
  <div class="flex items-center gap-2.5">
    <LogoIcon />
    <PageTitle :title="text" :sizeRem="1.9" :color="'secondary'" />
  </div>
</template>
