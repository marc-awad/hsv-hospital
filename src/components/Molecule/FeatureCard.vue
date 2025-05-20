<script setup lang="ts">
import FeatureIcon from "../Atoms/FeatureIcon.vue"
import PageTitle from "../Atoms/PageTitle.vue"
import SecondaryText from "../Atoms/SecondaryText.vue"

const props = defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div
    class="flex flex-col items-center text-center px-4 py-6 max-w-xs gap-y-3 shadow-md rounded-md mb-8"
  >
    <FeatureIcon>
      <slot name="icon" />
    </FeatureIcon>
    <PageTitle :title="props.title" :sizeRem="1.3" color="primary" />
    <SecondaryText :shade="600" :sizeRem="1" :maxWidthPx="400">
      {{ props.description }}
    </SecondaryText>
  </div>
</template>
