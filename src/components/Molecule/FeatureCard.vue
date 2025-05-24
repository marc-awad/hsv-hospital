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
    class="flex flex-col items-center text-center px-4 sm:px-5 md:px-6 py-4 sm:py-5 md:py-6 w-full max-w-xs sm:max-w-sm md:max-w-md gap-y-3 sm:gap-y-4 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-md sm:rounded-lg mb-6 sm:mb-8"
  >
    <FeatureIcon>
      <slot name="icon" />
    </FeatureIcon>
    <PageTitle
      :title="props.title"
      :sizeRem="1.1"
      :class="'sm:text-xl md:text-2xl'"
      color="primary"
    />
    <SecondaryText
      :shade="600"
      :sizeRem="0.9"
      :maxWidthPx="400"
      :class="'sm:text-base md:text-lg'"
    >
      {{ props.description }}
    </SecondaryText>
  </div>
</template>
