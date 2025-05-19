<!-- Usage template : 

<Paragraph>
  Ceci est un texte d’information ou une description.
</Paragraph>


-->

<script setup lang="ts">
defineProps<{
  className?: string
}>()
</script>

<template>
  <p :class="['paragraph', className]">
    <slot />
  </p>
</template>

<style scoped>
.paragraph {
  font-size: 1rem; /* 16px */
  line-height: 1.5;
  color: #374151; /* gray-700 */
  margin: 0 0 1rem 0;
}
</style>
