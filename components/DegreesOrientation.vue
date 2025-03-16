<template>
  <TresGroup>
    <TresMesh :position="[0, 1, startPoint]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white">180</div>
          <div class="w-2px h-300px bg-white"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[-startPoint, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="text-white">90</div>
          <div class="w-2px h-300px bg-white"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[startPoint, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white">270</div>
          <div class="w-2px h-300px bg-white"></div>
        </div>
      </Html>
    </TresMesh>
    <TresMesh :position="[0, 1, -startPoint]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class=" text-white">0</div>
          <div class="w-2px h-300px bg-white"></div>
        </div>
      </Html>
    </TresMesh>
  </TresGroup>
</template>

<script setup>
import { Html } from "@tresjs/cientos";
defineProps({
  startPoint: {
    type: Number,
    required: true,
    default: 30
  }
});
</script>

<style>
.mirror {
  transform: scaleX(-1);
}
</style>
