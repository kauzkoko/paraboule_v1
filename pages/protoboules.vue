<template>
  <div id="overlay">
    <TresCanvas>
      <XR />
    </TresCanvas>
    <Interface />
    <Predictions />
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";

const store = useProtoStore();

onMounted(async () => {
  await store.init();
});
</script>
