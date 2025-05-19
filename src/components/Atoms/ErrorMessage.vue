<!-- Usage template : 

<ErrorMessage :message="emailError" />

emailError.value = ""
  if (!email.value) {
    emailError.value = "L'email est obligatoire."
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    emailError.value = "Format d'email invalide."
  } else {
    alert("Formulaire envoyé !")
  }



-->

<template>
  <p v-if="message" class="error-message" role="alert">
    {{ message }}
  </p>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<style scoped>
.error-message {
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: #dc2626;
}
</style>
