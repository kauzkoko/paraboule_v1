<template>
  <TresCanvas>
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
      <TresSphereGeometry :args="[boule.size, 24, 24]" />
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
  selectedBoule: {
    type: Number,
    default: 0,
  },
});

const camera = useTemplateRef("camera");
const meshRefs = useTemplateRef("boulesRefs");

const supabase = useSupabaseClient();
let channel = supabase.channel("xr-controller");

const bus = useEventBus("tresjs");

const intersections = ref([
  {
    x: 0.15217870875827644,
    y: 0.11757755279540989,
    z: -2.14242094133827,
    class: "cochonet",
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

const screenPositions = ref([]);
function getScreenPosition(object, camera) {
  const vector = object.position.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (1 - (vector.y * 0.5 + 0.5)) * window.innerHeight;
  return { x, y };
}

const setFromIntersections = (intersections) => {
  let cochonet = intersections.find((item) => item.class === "cochonet");
  let offsetX = 0;
  let offsetY = 0;

  if (cochonet) {
    offsetX = cochonet.x * 30;
    offsetY = cochonet.z * 30;
  }

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

    if (item.class === "cochonet") {
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
    onComplete: () => {
      console.log("flyToCochonetAndBack complete");
    },
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
      console.log("startCircularRotation");
      hihat1.play();
      intervalId0deg = setInterval(() => {
        console.log("0deg");
        hihat1.play();
      }, duration * 1000);
      setTimeout(() => {
        hihat3.play();
        intervalId90deg = setInterval(() => {
          console.log("90deg");
          hihat2.play();
        }, duration * 1000);
      }, (duration * 1000) / 4);
      setTimeout(() => {
        hihat3.play();
        intervalId180deg = setInterval(() => {
          console.log("180deg");
          hihat3.play();
        }, duration * 1000);
      }, (duration * 1000) / 2);
      setTimeout(() => {
        hihat4.play();
        intervalId270deg = setInterval(() => {
          console.log("270deg");
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
  .on("broadcast", { event: "flyToCochonetAndBack" }, (event) => {
    console.log("flyToCochonetAndBack payload received: ", event.payload);
    flyToCochonetAndBack();
  })
  .subscribe();

watch(
  () => props.trigger,
  () => {
    trigger.value++;
  }
);

watch(
  () => props.isTouching,
  (newVal) => {
    console.log("isTouching changed:", newVal);
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
