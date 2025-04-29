<script setup lang="ts">
import { TresCanvas, useLoop } from "@tresjs/core";
import { BasicShadowMap, SRGBColorSpace, NoToneMapping } from "three";

const gl = {
  clearColor: "#82DBC5",
  shadows: true,
  alpha: false,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
};
</script>

<template>
  <TresCanvas v-bind="gl" window-size>
    <TextureScene />
  </TresCanvas>
  <div class="fixed top-0 left-0 w-full h-full items-center justify-center flex test">
      <div class="bg-red w-200px h-1000px test">test</div>
  </div>
</template>

<style scoped>
.test {
  mix-blend-mode: difference;
}
</style>
