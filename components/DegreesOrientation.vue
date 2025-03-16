<template>
  <TresGroup>
    <TresMesh :position="[0, 1, 20]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white">180°</div>
          <div class="w-2px h-300px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[-20, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white">270°</div>
          <div class="w-2px h-300px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[20, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white">90°</div>
          <div class="w-2px h-300px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[0, 1, -20]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white">0°</div>
          <div class="w-2px h-250px bg-gray"></div>
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
  color: white;
}
</style>
