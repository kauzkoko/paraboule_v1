<template>
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
    <CustomShaderMaterial
      v-bind="boule.player === 1 ? materialPropsRed : materialPropsBlue"
      transparent
      :opacity="checkSelectedBoules(index) ? 1 : 0"
      v-if="checkSelectedBoules(index)"
    />
    <Audio3D
      v-if="checkSelectedBoules(index)"
      :url="
        boule.player === 1
          ? store.currentSoundPlayer1
          : boule.player === 2
          ? store.currentSoundPlayer2
          : '/strudel/still.mp3'
      "
    />
    <TresMeshPhysicalMaterial
      :roughness="0.4"
      :metalness="1"
      :emissive="boule.color"
    />
  </TresMesh>
  <StundenOrientation :startPoint="startPoint" />
  <TresAmbientLight :intensity="230" />
  <TresDirectionalLight
    :position="[cameraX, cameraY, cameraZ]"
    :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
    :intensity="5"
  />
  <Grid />
</template>

<script setup>
import { useLoop, useRenderLoop } from "@tresjs/core";
import { CustomShaderMaterial } from "@tresjs/cientos";
import { gsap } from "gsap";

const { onLoop } = useRenderLoop();

onMounted(async () => {
  await nextTick();

  onLoop(() => {
    materialPropsRed.uniforms.u_Time.value +=
      0.01 * materialPropsRed.uniforms.u_WobbleSpeed.value;
    materialPropsBlue.uniforms.u_Time.value +=
      0.01 * materialPropsBlue.uniforms.u_WobbleSpeed.value;
  });
});

const { y } = useMouse();
const { height } = useWindowSize();
const { onBeforeRender } = useLoop();

const camera = useTemplateRef("camera");
const meshRefs = useTemplateRef("boulesRefs");

const bus = useEventBus("protoboules");

const store = useProtoStore();
const {
  boulesToDisplay: boules,
  hihatTriggers,
  isTouching,
} = storeToRefs(store);

const checkSelectedBoules = (index) => {
  if (store.volume === 0) return false;
  return store.selectedBoules.includes(index);
};

//interface controls
let circleAroundCochonet = false;

// camera controls / animations

let startPoint = 30;
const alpha = ref(0);
const rotationX = ref(0);
const cameraX = ref(0);
const cameraY = ref(1);
const cameraZ = ref(startPoint);

const screenPositions = ref([]);

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
  circleAroundCochonet = false;
  gsap.killTweensOf([alpha, cameraX, cameraY, cameraZ]);
}

function goToZero() {
  gsap.to(cameraX, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraY, {
    value: 1,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
}

onBeforeRender(({ delta, elapsed }) => {
  if (store.alphaController) {
    alpha.value = mappedRelativeAlpha.value;
  }
  if (store.isTouchingSlider) {
    console.log("isTouchingSlider", store.isTouchingSlider);
    cameraZ.value = map(y.value, 0, height.value, -30, 30);
  }
});

const mappedRelativeAlpha = computed(() => {
  let diff = store.gyroAlpha - store.baseAlpha;
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }
  const normalized = diff < 0 ? diff + 360 : diff;
  return normalized;
});

function lookAlongNegativeXAxis() {
  goToZero();
  gsap.to(alpha, {
    value: 90,
    duration: 1,
    ease: "power2.out",
  });
}

function lookAlongPositiveXAxis() {
  goToZero();
  gsap.to(alpha, {
    value: -90,
    duration: 1,
    ease: "power2.out",
  });
}

function lookAlongPositiveZAxis() {
  goToZero();
  gsap.to(alpha, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
}

function lookAlongNegativeZAxis() {
  goToZero();
  gsap.to(alpha, {
    value: 180,
    duration: 1,
    ease: "power2.out",
  });
}

const toggleTopCamera = () => {
  console.log("toggleTopCamera");
  if (store.isTopCamera) {
    frontCamera();
  } else {
    topCamera(70);
  }
  store.isTopCamera = !store.isTopCamera;
};

function topCamera(height = 50) {
  console.log("topCamera");
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
    value: height,
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
  frontCamera();
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

function flyToCochonet() {
  killTweens();
  gsap.to(cameraZ, {
    value: 0,
    duration: 3,
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
        duration: 0.2,
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
        duration: 0.2,
        ease: "linear",
      });
    },
  });
}

function startCircularRotation() {
  killTweens();
  let counter = 0;
  circleAroundCochonet = true;
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
    value: alpha.value - 360, // Full rotation
    duration: duration,
    delay: 1,
    // repeat: -1, // Infinite repetition
    ease: "none",
    onStart: () => {
      hihatTriggers.value[0]++;
      gsap.delayedCall(duration / 4 - 0.3, () => {
        if (circleAroundCochonet) {
          hihatTriggers.value[1]++;
        }
      });
      gsap.delayedCall(duration / 2 - 0.3, () => {
        if (circleAroundCochonet) {
          hihatTriggers.value[2]++;
        }
      });
      gsap.delayedCall((duration / 4) * 3 - 0.3, () => {
        if (circleAroundCochonet) {
          hihatTriggers.value[3]++;
        }
      });
    },
    onRepeat: () => {
      if (counter > 0) {
        hihatTriggers.value[0]++;
        flyToStart();
        circleAroundCochonet = false;
        return;
      }
      hihatTriggers.value[0]++;
      gsap.delayedCall(duration / 4 - 0.3, () => {
        if (circleAroundCochonet) {
          hihatTriggers.value[1]++;
        }
      });
      gsap.delayedCall(duration / 2 - 0.3, () => {
        if (circleAroundCochonet) {
          hihatTriggers.value[2]++;
        }
      });
      gsap.delayedCall((duration / 4) * 3 - 0.3, () => {
        if (circleAroundCochonet) {
          hihatTriggers.value[3]++;
        }
      });
      counter++;
    },
    onComplete: () => {
      hihatTriggers.value[0]++;
      // flyToStart();
      gsap.to(cameraZ, {
        value: startPoint,
        duration: 1,
        ease: "power2.out",
      });
      circleAroundCochonet = false;
      return;
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
  if (message === "lookAlongNegativeXAxis") {
    lookAlongNegativeXAxis();
  }
  if (message === "lookAlongPositiveXAxis") {
    lookAlongPositiveXAxis();
  }
  if (message === "lookAlongPositiveZAxis") {
    lookAlongPositiveZAxis();
  }
  if (message === "lookAlongNegativeZAxis") {
    lookAlongNegativeZAxis();
  }
  if (message === "flyToCochonet") {
    flyToCochonet();
  }
  if (message === "toggleTopCamera") {
    toggleTopCamera();
    console.log("toggleTopCamera", store.isTopCamera);
  }
});

// screen position for haptic feedback
watch(isTouching, (newVal) => {
  if (newVal) {
    const height =
      store.currentHapticGrid === "near"
        ? 30
        : store.currentHapticGrid === "medium"
        ? 50
        : 100;
    topCamera(height);
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
});
</script>

<style>
.mirror {
  transform: scaleX(-1);
  color: gray;
}
</style>
