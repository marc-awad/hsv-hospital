<script setup lang="ts">
const props = defineProps<{
  size?: number // taille optionnelle, par défaut 64
}>()

const size = props.size ?? 64
</script>

<template>
  <div
    class="flex items-center justify-center rounded-full bg-[#ede9fe] text-[var(--color-primary)]"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      fontSize: `${size * 0.27}px` /* approx 1.75rem for 64px */,
    }"
  >
    <slot />
  </div>
</template>
