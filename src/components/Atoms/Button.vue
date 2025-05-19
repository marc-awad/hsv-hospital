<!-- Usage template : 
 
<Button variant="primary" @click="submitForm">
    Valider
</Button>

<Button variant="secondary">
    Annuler
</Button>

-->
<template>
  <button
    :type="type"
    :class="['base-button', variantClass, { 'is-disabled': disabled }]"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    type?: "button" | "submit" | "reset"
    variant?: "primary" | "secondary" | "success" | "danger"
    disabled?: boolean
  }>(),
  {
    type: "button",
    variant: "primary",
    disabled: false,
  }
)

const variantClass = computed(() => {
  switch (props.variant) {
    case "primary":
      return "btn-primary"
    case "secondary":
      return "btn-secondary"
    case "success":
      return "btn-success"
    case "danger":
      return "btn-danger"
    default:
      return "btn-primary"
  }
})
</script>

<style scoped>
.base-button {
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: white;
}

.btn-primary {
  background-color: #5b21b6;
}
.btn-primary:hover {
  background-color: #7c3aed;
}

.btn-secondary {
  background-color: #6b7280;
}
.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-success {
  background-color: #16a34a;
}
.btn-success:hover {
  background-color: #15803d;
}

.btn-danger {
  background-color: #dc2626;
}
.btn-danger:hover {
  background-color: #b91c1c;
}

.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
