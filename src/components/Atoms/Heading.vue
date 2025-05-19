<!-- Usage template : 

<Heading level="1">Page Title</Heading>
<Heading level="2">Section Title</Heading>


-->

<script setup lang="ts">
defineProps<{
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
}>()

const level = __props.level ?? 1
const Tag = `h${level}` as keyof HTMLElementTagNameMap
</script>

<template>
  <component :is="Tag" :class="['heading', className]">
    <slot />
  </component>
</template>

<style scoped>
.heading {
  font-weight: 700;
  color: #1f2937; /* dark gray */
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

h1.heading {
  font-size: 2.25rem; /* 36px */
}
h2.heading {
  font-size: 1.875rem; /* 30px */
}
h3.heading {
  font-size: 1.5rem; /* 24px */
}
h4.heading {
  font-size: 1.25rem; /* 20px */
}
h5.heading {
  font-size: 1.125rem; /* 18px */
}
h6.heading {
  font-size: 1rem; /* 16px */
}
</style>
