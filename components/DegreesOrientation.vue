<template>
  <TresGroup>
    <TresMesh :position="[0, 1, 20]">
      <TresBoxGeometry :args="[1, 2, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--500px flex flex-col items-center">
          <div class="mirror">0</div>
          <div class="w-2px h-500px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[-20, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 2, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--500px flex flex-col items-center">
          <div class="mirror">270°</div>
          <div class="w-2px h-500px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[20, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 2, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--500px flex flex-col items-center">
          <div class="mirror">90°</div>
          <div class="w-2px h-500px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[0, 1, -20]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--500px flex flex-col items-center">
          <div>0°</div>
          <div class="w-2px h-500px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
  </TresGroup>
</template>

<script setup>
import { Html } from "@tresjs/cientos";
</script>

<style>
.mirror {
  transform: scaleX(-1);
  color: gray;
}
</style>
