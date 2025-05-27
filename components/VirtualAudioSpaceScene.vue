<template>
  <TresPerspectiveCamera :position="[cameraX, cameraY, cameraZ]" :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
    ref="camera" />
  <TresMesh v-for="(boule, index) in boulesToDisplay" :key="index" :iClass="boule.class" ref="boulesRefs"
    :position="[boule.x, 0, boule.y]">
    <TresSphereGeometry :args="[boule.size, 24, 24]" />
    <CustomShaderMaterial v-bind="boule.player === 1
      ? materialPropsRed
      : boule.player === 2
        ? materialPropsBlue
        : materialPropsYellow
      " transparent :opacity="checkSelectedBoules(index) ? 1 : 0" v-if="checkSelectedBoules(index)" />
    <Audio3D v-if="checkSelectedBoules(index)" :localPlaybackRate="1" :url="boule.player === 1
      ? store.currentSoundPlayer1
      : boule.player === 2
        ? store.currentSoundPlayer2
        : checkSelectedBoules(index)
          ? '/sounds/strudel/simplebeat.mp3'
          : '/strudel/still.mp3'
      " />
    <TresMeshPhysicalMaterial :roughness=".2" :metalness="1" :emissive="boule.color" />
  </TresMesh>
  <StundenOrientation :startPoint="startPoint" /> 
  <Sky v-if="store.isSky" :elevation="5" :distance="10" />
  <!-- <Environment preset="sunset" /> -->
  <!-- <TresAmbientLight :intensity="230" /> -->
  <TresDirectionalLight :position="[cameraX, cameraY, cameraZ]" :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
    :intensity="5" />
  <!-- <Suspense>
    <GravelFloor />
  </Suspense> -->
  <GridComponent />

  <Suspense>
      <EffectComposerPmndrs>
        <ChromaticAberrationPmndrs v-bind="effectProps" />
      </EffectComposerPmndrs>
    </Suspense>
</template>

<script setup>
import { useLoop, useRenderLoop } from "@tresjs/core";
import { CustomShaderMaterial, Sky, Environment } from "@tresjs/cientos";
import { gsap } from "gsap";
import { EffectComposerPmndrs, ChromaticAberrationPmndrs } from '@tresjs/post-processing'
import { Vector2 } from 'three'

const effectProps = {
  offset: new Vector2(0.02, 0.01),
  radialModulation: true,
  modulationOffset: 0
}

const { onLoop } = useRenderLoop();

onMounted(async () => {
  await nextTick();

  onLoop(() => {
    materialPropsRed.uniforms.u_Time.value +=
      0.01 * materialPropsRed.uniforms.u_WobbleSpeed.value;
    materialPropsBlue.uniforms.u_Time.value +=
      0.01 * materialPropsBlue.uniforms.u_WobbleSpeed.value;
    materialPropsYellow.uniforms.u_Time.value +=
      0.01 * materialPropsYellow.uniforms.u_WobbleSpeed.value;
  });
});

const { y } = useMouse();
const { height } = useWindowSize();
const { onBeforeRender } = useLoop();

const camera = useTemplateRef("camera");
const meshRefs = useTemplateRef("boulesRefs");

const bus = useEventBus("protoboules");

bus.on((message, payload) => {
  if (message === "flyToCochonnetAndBack") {
    flyToCochonnetAndBack();
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
  if (message === "flyToCochonnet") {
    flyToCochonnet();
  }
  if (message === "toggleTopCamera") {
    toggleTopCamera(payload.height);
  }

  if (message === "shootFilmBoule") {
    console.log("shootFilmBoule");
  }
});

const store = useProtoStore();
const { boulesToDisplay, hihatTriggers } = storeToRefs(store);

const checkSelectedBoules = (index) => {
  if (store.volume === 0) return false;
  return store.selectedBoules.includes(index);
};

watchEffect(() => {
  console.log(store.boulesToDisplay);
});
//interface controls
let circleAroundCochonnet = false;

// camera controls / animations

let startCameraY = .4;
let startPoint = 30;

const alpha = ref(0);
const rotationX = ref(0);
const cameraX = ref(0);
const cameraY = ref(startCameraY);
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
  circleAroundCochonnet = false;
  gsap.killTweensOf([alpha, cameraX, cameraY, cameraZ]);
}

function goToZero() {
  gsap.to(cameraX, {
    value: 0,
    duration: 1,
    ease: "power2.out",
  });
  gsap.to(cameraY, {
    value: startCameraY,
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
    cameraZ.value = map(y.value, 0, height.value, -30, 30);
  }
  if (store.isTouchingTopCameraSlider) {
    cameraY.value = map(y.value, 0, height.value, 10, 200);
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
    value: -270,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      hihatTriggers.value[3]++;
    },
  });
}

function lookAlongPositiveXAxis() {
  goToZero();
  gsap.to(alpha, {
    value: -90,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      hihatTriggers.value[1]++;
    },
  });
}

function lookAlongNegativeZAxis() {
  let goToAlpha = 0;
  if (alpha.value === -270) {
    goToAlpha = -360;
  } else {
    goToAlpha = 0;
  }
  goToZero();
  gsap.to(alpha, {
    value: goToAlpha,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      alpha.value = 0;
      hihatTriggers.value[0]++;
    },
  });
}

function lookAlongPositiveZAxis() {
  goToZero();
  gsap.to(alpha, {
    value: -180,
    duration: 1,
    ease: "power2.out",
    onComplete: () => {
      hihatTriggers.value[2]++;
    },
  });
}

const toggleTopCamera = (height = 80) => {
  if (store.isTopCamera) {
    frontCamera();
  } else {
    topCamera(height);
  }
  store.isTopCamera = !store.isTopCamera;
};

function topCamera(height = 80) {
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
    value: startCameraY,
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
  store.showStundenOrientation = false
  store.lookAlongCycler.state = "Look along 12 o'clock"
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

function flyToCochonnetAndBack() {
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

function flyToCochonnet() {
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
  circleAroundCochonnet = true;
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
    onStart: () => {
      gsap.delayedCall(0.7, () => {
        hihatTriggers.value[0]++;
      });
    },
  });
  let duration = 8;
  gsap.to(alpha, {
    value: alpha.value - 360, // Full rotation
    duration: duration,
    delay: 1,
    // repeat: -1, // Infinite repetition
    ease: "none",
    onStart: () => {
      gsap.delayedCall(duration / 4 - 0.3, () => {
        if (circleAroundCochonnet) {
          hihatTriggers.value[1]++;
        }
      });
      gsap.delayedCall(duration / 2 - 0.3, () => {
        if (circleAroundCochonnet) {
          hihatTriggers.value[2]++;
        }
      });
      gsap.delayedCall((duration / 4) * 3 - 0.3, () => {
        if (circleAroundCochonnet) {
          hihatTriggers.value[3]++;
        }
      });
    },
    onRepeat: () => {
      if (counter > 0) {
        hihatTriggers.value[0]++;
        flyToStart();
        circleAroundCochonnet = false;
        return;
      }
      hihatTriggers.value[0]++;
      gsap.delayedCall(duration / 4 - 0.3, () => {
        if (circleAroundCochonnet) {
          hihatTriggers.value[1]++;
        }
      });
      gsap.delayedCall(duration / 2 - 0.3, () => {
        if (circleAroundCochonnet) {
          hihatTriggers.value[2]++;
        }
      });
      gsap.delayedCall((duration / 4) * 3 - 0.3, () => {
        if (circleAroundCochonnet) {
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
      circleAroundCochonnet = false;
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

// screen position for haptic feedback
watch(
  () => store.isTouchingHaptic,
  (newVal) => {
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
  }
);
</script>

<style>
.mirror {
  transform: scaleX(-1);
  color: gray;
}
</style>
