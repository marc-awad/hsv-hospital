<script setup lang="ts">
import { RouterLink } from "vue-router"

const props = defineProps<{
  to?: string
  variant?: "primary" | "secondary" | "tertiary"
}>()

const variant = props.variant ?? "primary"

const baseClasses =
  "inline-flex items-center gap-2 py-3 px-6 rounded-lg font-semibold cursor-pointer transition-all duration-200 text-lg no-underline"

const classes =
  variant === "primary"
    ? `${baseClasses} bg-primary text-white hover:bg-primary-hover`
    : variant === "secondary"
    ? `${baseClasses} bg-white text-primary border border-primary hover:bg-gray-200 hover:text-primary`
    : `${baseClasses} bg-white text-black border border-gray-400 hover:bg-gray-200 hover:text-black`
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot name="icon" />
    <slot />
  </RouterLink>
  <button v-else type="button" :class="classes">
    <slot name="icon" />
    <slot />
  </button>
</template>
