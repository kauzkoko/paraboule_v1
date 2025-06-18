<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen">
    <div class="text-white text-4xl">{{ error.statusCode }}</div>
    <NuxtLink to="/" class="text-white text-4xl">/</NuxtLink>
  </div>
</template>
