<!-- Usage template :
 
<Label for-id="first-name" required>Prénom</Label>

-->

<template>
  <label :for="forId" class="label">
    <slot />
    <span v-if="required" class="required">*</span>
  </label>
</template>

<script setup lang="ts">
defineProps<{
  forId: string
  required?: boolean
}>()
</script>

<style scoped>
.label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #374151;
}

.required {
  color: #ef4444;
  margin-left: 0.125rem;
}
</style>
