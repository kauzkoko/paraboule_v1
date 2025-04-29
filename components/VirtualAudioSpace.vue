<template>
  <TresCanvas shadows alpha window-size>
    <Suspense>
      <VirtualAudioSpaceScene />
    </Suspense>
  </TresCanvas>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";
</script>

