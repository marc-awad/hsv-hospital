<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  label: string
  inputId: string
  required?: boolean
  options: { label: string; value: string }[]
  placeholder?: string
  modelValue: string
}>()

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void
}>()

const labelClass = computed(() => {
  return [
    "font-medium text-gray-700 text-left",
    props.required ? 'after:content-["*"] after:ml-0.5 after:text-red-500' : "",
  ]
})

const updateValue = (event: Event) => {
  emit("update:modelValue", (event.target as HTMLSelectElement).value)
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="inputId" :class="labelClass">
      {{ label }}
    </label>
    <select
      :id="inputId"
      :required="required"
      :value="modelValue"
      @change="updateValue"
      class="form-select w-full px-4 py-3 border rounded-md text-base text-gray-900 bg-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
    >
      <option value="" disabled hidden>
        {{ placeholder || "Select an option" }}
      </option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
