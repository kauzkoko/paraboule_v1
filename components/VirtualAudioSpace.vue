<template>
  <TresCanvas>
    <TresPerspectiveCamera
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
      ref="camera"
    />
    <TresMesh
      v-for="(boule, index) in boules"
      :key="index"
      :iClass="boule.class"
      ref="boulesRefs"
      :position="[boule.x, 0, boule.y]"
    >
      <TresSphereGeometry :args="[boule.size, 24, 24]" />
      <!-- <Outline :thickness="3" color="#ffff00" /> -->
      <TresMeshPhysicalMaterial
        :roughness="0.4"
        :metalness="1"
        :emissive="boule.color"
      />
      <Suspense>
        <PositionalAudio
          ref="positionalAudioRef"
          :ready="true"
          loop
          v-if="store.currentlySelectedBouleIndex === index"
          :helper="helpers"
          :autoplay="false"
          :key="trigger"
          :url="
            boule.player === 1
              ? sounds.noise.high
              : boule.player === 2
              ? sounds.noise.medium
              : '/strudel/still.mp3'
          "
        />
      </Suspense>
    </TresMesh>
    <DegreesOrientation :startPoint="startPoint" />
    <TresAmbientLight :intensity="230" />
    <TresDirectionalLight
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
      :intensity="5"
    />
    <Grid />
  </TresCanvas>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";
import { PositionalAudio, Outline } from "@tresjs/cientos";
import { gsap } from "gsap";

const props = defineProps({
  isTouching: {
    type: Boolean,
    default: false,
  },
  trigger: {
    type: Number,
    required: true,
  },
});

const camera = useTemplateRef("camera");
const meshRefs = useTemplateRef("boulesRefs");

const supabase = useSupabaseClient();
let animationController = supabase.channel("animation-controller");

const bus = useEventBus("protoboules");

const store = useProtoStore();
const { sortedBoules: boules, helpers } = storeToRefs(store);

//interface controls
const trigger = ref(0);

// camera controls / animations
let intervalId0deg, intervalId90deg, intervalId180deg, intervalId270deg;

let startPoint = 30;
const alpha = ref(0);
const rotationX = ref(0);
const cameraX = ref(0);
const cameraY = ref(1);
const cameraZ = ref(startPoint);

const screenPositions = ref([]);

const circleAroundCochonet = ref(false);
const hihat1 = new Audio("/sounds/strudel/hiihat1.mp3");
const hihat2 = new Audio("/sounds/strudel/hiihat2.mp3");
const hihat3 = new Audio("/sounds/strudel/hiihat3.mp3");
const hihat4 = new Audio("/sounds/strudel/hiihat4.mp3");

let sounds = {};
sounds.noise = {
  low: "/sounds/noiselow.mp3",
  medium: "/sounds/noz.mp3",
  high: "/sounds/noz2.mp3",
};

sounds.colors = {
  color: "/sounds/color.mp3",
  white: "/sounds/white.mp3",
  blue: "/sounds/blue.mp3",
};

function killTweens() {
  clearIntervals();
  gsap.killTweensOf([alpha, cameraX, cameraY, cameraZ]);
}

function topCamera() {
  gsap.to(cameraX, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraY, {
    value: 30,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(rotationX, {
    value: -Math.PI / 2,
    duration: 1,
    ease: "power2.out",
  });
}

function frontCamera() {
  gsap.to(cameraX, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: startPoint,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraY, {
    value: 1,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(rotationX, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(alpha, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
}

function flyToStart() {
  killTweens();
  gsap.to(cameraX, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: startPoint,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(alpha, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
}

function flyToCochonetAndBack() {
  killTweens();
  gsap.to(cameraZ, {
    value: 0,
    duration: 3,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: startPoint,
    duration: 3,
    delay: 4,
    ease: "power2.out",
  });
}

function stalefish180() {
  killTweens();

  gsap.to(cameraZ, {
    value: -startPoint,
    duration: 3,
    ease: "linear",
    onComplete: () => {
      gsap.to(alpha, {
        value: alpha.value + 180,
        duration: 0,
        ease: "linear",
      });
    },
  });

  gsap.to(cameraZ, {
    value: startPoint,
    duration: 3,
    delay: 4,
    ease: "linear",
    onComplete: () => {
      gsap.to(alpha, {
        value: alpha.value + 180,
        duration: 0,
        ease: "linear",
      });
    },
  });
}

function clearIntervals() {
  if (intervalId0deg) {
    clearInterval(intervalId0deg);
    intervalId0deg = null;
    circleAroundCochonet.value = false;
  }
  if (intervalId90deg) {
    clearInterval(intervalId90deg);
    intervalId90deg = null;
    circleAroundCochonet.value = false;
  }
  if (intervalId180deg) {
    clearInterval(intervalId180deg);
    intervalId180deg = null;
    circleAroundCochonet.value = false;
  }
  if (intervalId270deg) {
    clearInterval(intervalId270deg);
    intervalId270deg = null;
    circleAroundCochonet.value = false;
  }
}

function startCircularRotation() {
  circleAroundCochonet.value = true;
  let counter = 0;
  killTweens();
  const targetX = 0;
  const targetZ = 0;
  gsap.to(cameraX, {
    value: targetX,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: targetZ,
    duration: 1,
    ease: "power2.out",
  });
  let duration = 8;
  gsap.to(alpha, {
    value: alpha.value + 360, // Full rotation
    duration: duration,
    delay: 1,
    repeat: -1, // Infinite repetition
    ease: "none",
    onStart: () => {
      hihat1.play();
      intervalId0deg = setInterval(() => {
        hihat1.play();
      }, duration * 1000);
      setTimeout(() => {
        hihat3.play();
        intervalId90deg = setInterval(() => {
          hihat2.play();
        }, duration * 1000);
      }, (duration * 1000) / 4);
      setTimeout(() => {
        hihat3.play();
        intervalId180deg = setInterval(() => {
          hihat3.play();
        }, duration * 1000);
      }, (duration * 1000) / 2);
      setTimeout(() => {
        hihat4.play();
        intervalId270deg = setInterval(() => {
          hihat4.play();
        }, duration * 1000);
      }, ((duration * 1000) / 4) * 3);
    },
    onRepeat: () => {
      if (counter > 0) {
        hihat1.play();
        flyToStart();
        clearIntervals();
      }
      counter++;
    },
  });
}

function getScreenPosition(object, camera) {
  const vector = object.position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
  return { x, y };
}

onKeyStroke(["ArrowDown"], (e) => {
  e.preventDefault();
  flyToStart();
});

bus.on((message) => {
  if (message === "flyToCochonetAndBack") {
    flyToCochonetAndBack();
  }
  if (message === "flyToStart") {
    flyToStart();
  }
  if (message === "stalefish180") {
    stalefish180();
  }
  if (message === "startCircularRotation") {
    startCircularRotation();
  }
});

animationController
  .on("broadcast", { event: "startCircularRotation" }, (event) => {
    startCircularRotation();
  })
  .on("broadcast", { event: "flyToCochonetAndBack" }, (event) => {
    flyToCochonetAndBack();
  })
  .subscribe();

// trigger for spatial audio
watch(
  () => props.trigger,
  () => {
    trigger.value++;
  }
);

// screen position for haptic feedback
watch(
  () => props.isTouching,
  (newVal) => {
    if (newVal) {
      topCamera();
      setTimeout(() => {
        if (meshRefs.value.length < 1) return;
        let darkCounter = 0;
        let lightCounter = 0;
        meshRefs.value.forEach((mesh) => {
          const screenPos = getScreenPosition(mesh, camera.value);
          if (mesh.iClass === "dark") {
            darkCounter++;
          }
          if (mesh.iClass === "light") {
            lightCounter++;
          }
          screenPositions.value.push({
            ...screenPos,
            class: mesh.iClass,
            classNumber: mesh.iClass === "dark" ? darkCounter : lightCounter,
          });
        });
        bus.emit("screenPositions", screenPositions.value);
      }, 1000);
    } else {
      frontCamera();
    }
  }
);
</script>

<style>
.mirror {
  transform: scaleX(-1);
  color: gray;
}
</style>
