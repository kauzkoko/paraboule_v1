<template>
  <TresMesh>
    <Suspense>
      <PositionalAudio
        ref="positionalAudioRef"
        :ready="true"
        loop
        :helper="true"
        :autoplay="false"
        :key="trigger + props.localTrigger + props.index"
        :url="props.url ?? props.src"
      />
    </Suspense>
  </TresMesh>
</template>

<script setup>
import { PositionalAudio } from "@tresjs/cientos";

const props = defineProps({
  url: {
    type: String,
    default: "/sounds/strudel/c3major.mp3",
  },
  src: {
    type: String,
    default: "/sounds/strudel/c3major.mp3",
  },
  localTrigger: {
    type: Number,
    default: 0,
  },
  index: {
    type: Number,
    default: 0,
  },
  localHelper: {
    type: Boolean,
    default: false,
  },
  localVolume: {
    type: Number,
    default: 1,
  },
});

const positionalAudioRef = useTemplateRef("positionalAudioRef");
const store = useProtoStore();
const { volume, trigger } = storeToRefs(store);

watchEffect(() => {
  trigger.value = props.localTrigger;
  if (positionalAudioRef.value) {
    positionalAudioRef.value.instance.visible = props.localHelper;
    positionalAudioRef.value.instance.gain.gain.value = volume.value ?? props.localVolume;
  }
});
</script>
