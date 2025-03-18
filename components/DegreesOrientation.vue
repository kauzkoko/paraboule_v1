<template>
  <TresGroup>
    <TresMesh :position="[0, 1, startPoint]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white text-30px">180</div>
          <div class="flex flex-row items-center">
            <div class="w-2px h-300px bg-white"></div>
            <div class="w-2px h-300px bg-white mx-12px"></div>
            <div class="w-2px h-300px bg-white"></div>
          </div>
        </div>
      </Html>
      <Suspense>
        <PositionalAudio
          ref="hihat3Ref"
          :ready="true"
          :helper="true"
          :autoplay="false"
          :key="hihatTriggers[2]"
          :url="hihat3Src"
        />
      </Suspense>
    </TresMesh>
    <TresMesh :position="[-startPoint, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="text-white text-30px">90</div>
          <div class="flex flex-row items-center">
            <div class="w-2px h-300px bg-white mr-12px"></div>
            <div class="w-2px h-300px bg-white"></div>
          </div>
        </div>
      </Html>
      <Suspense>
        <PositionalAudio
          ref="hihat2Ref"
          :ready="true"
          :helper="true"
          :autoplay="false"
          :key="hihatTriggers[1]"
          :url="hihat2Src"
        />
      </Suspense>
    </TresMesh>
    <TresMesh :position="[startPoint, 1, 0]" :rotation="[0, Math.PI / 2, 0]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white text-30px">270</div>
          <div class="flex flex-row items-center">
            <div class="w-2px h-300px bg-white mr-12px"></div>
            <div class="w-2px h-300px bg-white mr-12px"></div>
            <div class="w-2px h-300px bg-white mr-12px"></div>
            <div class="w-2px h-300px bg-white"></div>
          </div>
        </div>
      </Html>
      <Suspense>
        <PositionalAudio
          ref="hihat4Ref"
          :ready="true"
          :helper="true"
          :autoplay="false"
          :key="hihatTriggers[3]"
          :url="hihat4Src"
        />
      </Suspense>
    </TresMesh>
    <TresMesh :position="[0, 1, -startPoint]">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="white" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--300px flex flex-col items-center">
          <div class="mirror text-white text-30px">0</div>
          <div class="flex flex-row items-center">
            <div class="w-2px h-300px bg-white"></div>
          </div>
        </div>
      </Html>
      <Suspense>
        <PositionalAudio
          ref="hihat1Ref"
          :ready="true"
          :helper="true"
          :autoplay="false"
          :key="hihatTriggers[0]"
          :url="hihat1Src"
        />
      </Suspense>
    </TresMesh>
  </TresGroup>
</template>

<script setup>
import { useTresContext } from "@tresjs/core";
import { Html, PositionalAudio } from "@tresjs/cientos";

defineProps({
  startPoint: {
    type: Number,
    required: true,
    default: 30,
  },
});

const store = useProtoStore();
const { hihatTriggers } = storeToRefs(store);

const hihat1Ref = ref(null);
const hihat2Ref = ref(null);
const hihat3Ref = ref(null);
const hihat4Ref = ref(null);
watchEffect(() => {
  if (hihat1Ref.value) {
    hihat1Ref.value.instance.visible = false;
  }
  if (hihat2Ref.value) {
    hihat2Ref.value.instance.visible = false;
  }
  if (hihat3Ref.value) {
    hihat3Ref.value.instance.visible = false;
  }
  if (hihat4Ref.value) {
    hihat4Ref.value.instance.visible = false;
  }
});

const hihat1Src = ref("");
const hihat2Src = ref("");
const hihat3Src = ref("");
const hihat4Src = ref("");
setTimeout(() => {
  hihat1Src.value = "/sounds/strudel/hiihat1.mp3";
  hihat2Src.value = "/sounds/strudel/hiihat2.mp3";
  hihat3Src.value = "/sounds/strudel/hiihat3.mp3";
  hihat4Src.value = "/sounds/strudel/hiihat4.mp3";
}, 1000);
</script>

<style>
.mirror {
  /* transform: scaleX(-1); */
  direction: rtl;
  color: white !important;
}
</style>
