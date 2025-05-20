<script lang="ts" setup>
const props = defineProps<{
  title: string
  sizeRem?: number
  color?: "primary" | "secondary" | "error" // ajoute les couleurs que tu souhaites
}>()

const textSize = `${props.sizeRem ?? 2.25}rem`

const colorMap: Record<string, string> = {
  primary: "#0f172a", // slate 12
  secondary: "#7c3aed", // mauve 9
  error: "#ef4444", // rouge
}

const textColor = colorMap[props.color ?? "primary"] ?? "#0f172a"
</script>

<template>
  <h1
    class="font-semibold tracking-[-0.02em]"
    :style="{ color: textColor, fontSize: textSize }"
  >
    {{ title }}
  </h1>
</template>
