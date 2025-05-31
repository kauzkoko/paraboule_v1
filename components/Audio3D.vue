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
    // default: "/sounds/strudel/c3major.mp3",
  },
  src: {
    type: String,
    // default: "/sounds/strudel/c3major.mp3",
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
  localPlaybackRate: {
    type: Number,
    default: 1,
  },
});

const positionalAudioRef = useTemplateRef("positionalAudioRef");
const store = useProtoStore();
const { volume, trigger } = storeToRefs(store);
import { gsap } from "gsap";

watch(() => store.volumePulse, () => {
  if (positionalAudioRef.value) {
    console.log("volumePulse", store.volumePulse);
    gsap.to(positionalAudioRef.value.instance.gain.gain, {
      value: 2,
      duration: .3,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(positionalAudioRef.value.instance.gain.gain, {
          value: 1,
          duration: 0.2,
          ease: "power2.out",
        });
      },
    });
  }
});


// if (positionalAudioRef.value) {
//   positionalAudioRef.value.instance.gain.gain.value = 0;
// }

watchEffect(() => {
  trigger.value = props.localTrigger;
  if (positionalAudioRef.value) {
    positionalAudioRef.value.instance.playbackRate = props.localPlaybackRate;
    positionalAudioRef.value.instance.visible = props.localHelper;
    gsap.to(positionalAudioRef.value.instance.gain.gain, {
      value: volume.value ?? props.localVolume,
      duration: 5,
      ease: "power2.out"
    });
  }
});

onMounted(() => {
  if (positionalAudioRef.value) {
    gsap.to(positionalAudioRef.value.instance.gain.gain, {
      value: 1,
      duration: 1,
      ease: "power2.out"
    });
  }
});

onUnmounted(() => {
  if (positionalAudioRef.value) {
    gsap.to(positionalAudioRef.value.instance.gain.gain, {
      value: 0,
      duration: 1,
      ease: "power2.in"
    });
  }
});
</script>
