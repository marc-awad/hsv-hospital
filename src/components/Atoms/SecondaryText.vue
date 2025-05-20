<script setup lang="ts">
const props = defineProps<{
  shade?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
  sizeRem?: number
  maxWidthPx?: number | string // ex: 600 (px) ou "600px"
}>()

const shade = props.shade ?? 500
const sizeRem = props.sizeRem ?? 1

const shadeMap: Record<number, string> = {
  100: "text-gray-100",
  200: "text-gray-200",
  300: "text-gray-300",
  400: "text-gray-400",
  500: "text-gray-500",
  600: "text-gray-600",
  700: "text-gray-700",
  800: "text-gray-800",
  900: "text-gray-900",
}

const textColorClass = shadeMap[shade]
const fontSizeStyle = { fontSize: `${sizeRem}rem` }

const maxWidthStyle = props.maxWidthPx
  ? {
      maxWidth:
        typeof props.maxWidthPx === "number"
          ? `${props.maxWidthPx}px`
          : props.maxWidthPx,
    }
  : {}
</script>

<template>
  <p :class="textColorClass" :style="{ ...fontSizeStyle, ...maxWidthStyle }">
    <slot />
  </p>
</template>
