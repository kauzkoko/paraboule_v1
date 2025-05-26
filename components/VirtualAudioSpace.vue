<template>
  <TresCanvas shadows alpha window-size v-bind="gl">
    <Suspense>
      <VirtualAudioSpaceScene />
    </Suspense>
  </TresCanvas>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";
import { NoToneMapping } from 'three'
const gl = {
  toneMapping: NoToneMapping,
}
</script>

