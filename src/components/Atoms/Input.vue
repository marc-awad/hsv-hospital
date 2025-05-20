<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  label: string
  inputId: string
  type?: string
  placeholder?: string
  required?: boolean
}>()

const labelClass = computed(() => {
  return [
    "text-sm font-medium text-gray-700",
    props.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : "",
  ]
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="inputId" :class="labelClass">
      {{ label }}
    </label>
    <input
      :id="inputId"
      :type="type || 'text'"
      :placeholder="placeholder"
      :required="required"
      class="form-input w-full px-4 py-3 border rounded-md text-base text-gray-900 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
    />
  </div>
</template>
