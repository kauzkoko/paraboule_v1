<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
      ref="camera"
    />
    <TresMesh
      v-for="(boule, i) in boules"
      :key="i"
      :iClass="boule.class"
      ref="boulesRefs"
      :position="[boule.x, 0, boule.y]"
    >
      <TresSphereGeometry :args="[boule.size, 16, 16]" />
      <Outline :thickness="3" color="#ff0000" />
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
          v-if="props.selectedBoule === i"
          :helper="true"
          :autoplay="false"
          :key="trigger"
          :url="
            boule.player === 0 && cochonetteSound
              ? sounds.noise.low
              : boule.player === 1
              ? sounds.noise.high
              : boule.player === 2
              ? sounds.noise.medium
              : '/strudel/still.mp3'
          "
        />
      </Suspense>
    </TresMesh>
    <DegreesOrientation />
    <TresAmbientLight :intensity="230" />
    <TresDirectionalLight
      ref="directionalLightRef"
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
      :intensity="5"
    />
    <Grid
      :args="[10.5, 10.5]"
      cell-color="#ff0000"
      :cell-size="1"
      :cell-thickness="0.5"
      section-color="#ff0000"
      :section-size="1"
      :section-thickness="2"
      :infinite-grid="true"
      :fade-from="0"
      :fade-distance="30"
      :fade-strength="1"
    />
  </TresCanvas>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";
import {
  Html,
  PositionalAudio,
  Grid,
  Outline,
  Superformula,
} from "@tresjs/cientos";
import { gsap } from "gsap";

const gl = {
  alpha: true,
  // windowSize: true,
};

const directionalLight = useTemplateRef("directionalLightRef");

const camera = useTemplateRef("camera");
const meshRefs = useTemplateRef("boulesRefs");
function getScreenPosition(object, camera) {
  const vector = object.position.clone().project(camera);

  // Convert NDC (-1 to 1) to screen coordinates
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;

  return { x, y };
}

const props = defineProps({
  isTouching: {
    type: Boolean,
    default: false,
  },
  trigger: {
    type: Number,
    required: true,
  },
  selectedBoule: {
    type: Number,
    default: 0,
  },
});

watch(
  () => props.trigger,
  (newVal) => {
    trigger.value++;
  }
);

const screenPositions = ref([]);
watch(
  () => props.isTouching,
  (newVal) => {
    console.log("isTouching changed:", newVal);
    if (newVal) {
      // Perform actions when isTouching becomes true
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
          screenPositions.value.push({ ...screenPos, class: mesh.iClass, classNumber: mesh.iClass === "dark" ? darkCounter : lightCounter });
        });
        bus.emit("screenPositions", screenPositions.value);
      }, 1000);
    } else {
      frontCamera();
      // Perform actions when isTouching becomes false
    }
  }
);

const bus = useEventBus("tresjs");
bus.on((message) => {
  if (message === "flyToCochonetteAndBack") {
    console.log("flyToCochonetteAndBack");
    flyToCochonetteAndBack();
  }
});

const supabase = useSupabaseClient();
let channel = supabase.channel("xr-controller");

const locked = ref(false);

const intersections = ref([
  {
    x: 0.15217870875827644,
    y: 0.11757755279540989,
    z: -2.14242094133827,
    class: "cochonette",
  },
  {
    x: 0.3014103032020119,
    y: 0.11757755279540989,
    z: -2.1185530158534984,
    class: "dark",
  },
  {
    x: 0.29827494002689575,
    y: 0.11757755279540984,
    z: -1.873205403607142,
    class: "light",
  },
  {
    x: 0.35239538925638664,
    y: 0.10841178894042934,
    z: -2.040454871744344,
    class: "dark",
  },
  {
    x: 0.40640927469181287,
    y: 0.10841178894042956,
    z: -1.9825655394221926,
    class: "light",
  },
]);
const { history } = useRefHistory(intersections, { deep: true });

const store = useProtoStore();
const { boules } = storeToRefs(store);

const setFromIntersections = (intersections) => {
  let cochonette = intersections.find((item) => item.class === "cochonette");
  let offsetX = 0;
  let offsetY = 0;

  if (cochonette) {
    offsetX = cochonette.x * 30;
    offsetY = cochonette.z * 30;
  }

  if (!locked.value) {
    boules.value = [];
    intersections.forEach((item) => {
      let boule = {
        x: item.x * 30 - offsetX,
        y: item.z * 30 - offsetY,
        color: "yellow",
        size: 1,
        player: 3,
        class: item.class,
      };

      if (item.class === "cochonette") {
        boule.color = "orange";
        boule.size = 0.4;
        boule.player = 0;
      } else if (item.class === "dark") {
        boule.color = "#111";
        boule.player = 1;
      } else if (item.class === "light") {
        boule.color = "#333";
        boule.player = 2;
      }

      boules.value.push(boule);
    });
  }
};
setFromIntersections(intersections.value);

channel
  .on("broadcast", { event: "intersections" }, (data) => {
    console.log("payload received: ", data.payload.intersections);
    intersections.value = data.payload.intersections;
    console.log(history.value);

    setFromIntersections(data.payload.intersections);
  })
  .subscribe();

let animationController = supabase.channel("animation-controller");
animationController
  .on("broadcast", { event: "startCircularRotation" }, (event) => {
    console.log("startCircularRotation payload received: ", event.payload);
    startCircularRotation();
  })
  .on("broadcast", { event: "flyToCochonetteAndBack" }, (event) => {
    console.log("flyToCochonetteAndBack payload received: ", event.payload);
    flyToCochonetteAndBack();
  })
  .subscribe();

// audio
let sounds = {};
sounds.noise = {
  low: "/sounds/noiselow.mp3",
  // medium: "/noise.mp3",
  medium: "/sounds/noz.mp3",
  // high: "/noisehigh.mp3",
  high: "/sounds/noz2.mp3",
};

sounds.colors = {
  color: "/sounds/color.mp3",
  white: "/sounds/white.mp3",
  blue: "/sounds/blue.mp3",
};

//interface controls
const trigger = ref(0);
const cochonetteSound = ref(false);
watch(cochonetteSound, () => {
  console.log("cochonetteSound");
  trigger.value++;
});

const helpers = ref(true);
const grid = ref(true);
const controller = ref(true);

// camera controls / animations
const alpha = ref(0);
const rotationX = ref(0);
const cameraZ = ref(20);
const cameraX = ref(0);
const cameraY = ref(1);

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
    // value: 20,
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

function halfCamera() {
  gsap.to(cameraX, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: 7,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraY, {
    value: 5,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(rotationX, {
    value: -Math.PI / 5,
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
    value: 20,
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
    value: 20,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(alpha, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
}

function killTweens() {
  // frontCamera();
  clearIntervals();
  gsap.killTweensOf([alpha, cameraX, cameraZ]);
}

function flyToCochonetteAndBack() {
  killTweens();
  const angleInRadians = (alpha.value * Math.PI) / 180;
  const targetX = cameraX.value - 20 * Math.sin(angleInRadians);
  const targetZ = cameraZ.value - 20 * Math.cos(angleInRadians);

  gsap.to(cameraX, {
    value: targetX,
    duration: 3,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: targetZ,
    duration: 3,
    ease: "power2.out",
  });

  // Return to original position
  gsap.to(cameraX, {
    value: 0,
    duration: 3,
    delay: 4,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: 20,
    duration: 3,
    delay: 4,
    ease: "power2.out",
    onComplete: () => {
      console.log("animation complete");
    },
  });
}

function flyThroughCochonetteToTheEndless() {
  flyToStart();
  const angleInRadians = (alpha.value * Math.PI) / 180;
  const targetX = cameraX.value - 100 * Math.sin(angleInRadians);
  const targetZ = cameraZ.value - 100 * Math.cos(angleInRadians);

  gsap.to(cameraX, {
    value: targetX,
    duration: 5,
    ease: "none",
  });
  gsap.to(cameraZ, {
    value: targetZ,
    duration: 5,
    ease: "none",
  });
}

function flyToRealisticStart() {
  killTweens();
  gsap.to(cameraX, {
    value: 0,
    duration: 2,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: 37,
    duration: 2,
    ease: "power2.out",
  });
  gsap.to(cameraY, {
    value: 31,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(rotationX, {
    value: -Math.PI / 8,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(alpha, {
    value: 0,
    duration: 2,
    ease: "power2.out",
  });
}

let intervalIdPlayer, intervalIdFront;
function clearIntervals() {
  if (intervalIdFront) {
    clearInterval(intervalIdFront);
    intervalIdFront = null; // Reset the intervalIdFront to null
    circleAroundCochonet.value = false;
  }
  if (intervalIdPlayer) {
    clearInterval(intervalIdPlayer);
    intervalIdPlayer = null; // Reset the intervalIdPlayer to null
    circleAroundCochonet.value = false;
  }
}

const circleAroundCochonet = ref(false);
const frontAudio = new Audio("/sounds/strudel/hh.mp3");
const startAudio = new Audio("/sounds/strudel/hh2.mp3");
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
  gsap.to(alpha, {
    value: alpha.value + 360, // Full rotation
    duration: 3,
    delay: 1,
    repeat: -1, // Infinite repetition
    ease: "none",
    onStart: () => {
      console.log("startCircularRotation");
      intervalIdFront = setInterval(() => {
        console.log("looking to front");
        frontAudio.play();
      }, 10000);
      setTimeout(() => {
        startAudio.play();
        intervalIdPlayer = setInterval(() => {
          console.log("looking at player");
          startAudio.play();
        }, 10000);
      }, 5000);
    },
    onRepeat: () => {
      if (counter > 0) {
        flyToStart();
        clearIntervals();
      }
      counter++;
    },
    onComplete: () => {
      clearIntervals();
      console.log("animation complete");
    },
  });
}
</script>

<style>
.mirror {
  transform: scaleX(-1);
  color: gray;
}
</style>
