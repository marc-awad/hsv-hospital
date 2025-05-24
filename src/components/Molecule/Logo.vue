<script setup lang="ts">
import LogoIcon from "../Atoms/LogoIcon.vue"
import PageTitle from "../Atoms/PageTitle.vue"

defineProps<{ text: string }>()
</script>

<template>
  <div class="flex items-center gap-2 sm:gap-2.5 md:gap-3">
    <LogoIcon class="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 flex-shrink-0" />
    <PageTitle
      :title="text"
      :sizeRem="1.2"
      :color="'secondary'"
      :class="'text-lg sm:text-xl md:text-2xl lg:text-3xl truncate'"
    />
  </div>
</template>
