<script setup lang="ts">
import { TresCanvas } from "@tresjs/core";
import { OrbitControls } from "@tresjs/cientos";
</script>

<template>
  <TresCanvas clear-color="#82DBC5" shadows alpha window-size>
    <OrbitControls />
    <TresAmbientLight />
    <TresDirectionalLight />
    <Suspense>
      <Texture />
    </Suspense>
  </TresCanvas>
</template>
