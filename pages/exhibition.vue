<template>
  <div id="overlay">
    <!-- <TresCanvas>
      <XRonly />
    </TresCanvas> -->
    <Interface />
    <!-- <Predictions /> -->
     <Info />
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";

const store = useProtoStore();

onMounted(async () => {
  await store.init();
});
</script>
