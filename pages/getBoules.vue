<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
      :args="[82, 1, 0.1, 1000]"
    />
    <TresMesh
      v-for="(boule, i) in boules"
      :key="i"
      :position="[boule.x, 0, boule.y]"
    >
      <TresSphereGeometry :args="[boule.size, 16, 16]" />
      <TresMeshStandardMaterial :color="boule.color" />
      <Suspense>
        <PositionalAudio
          ref="positionalAudioRef"
          :ready="true"
          loop
          :helper="helpers"
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
    <TresMesh :position="[0, 1, 20]">
      <TresBoxGeometry :args="[1, 2, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--120px flex flex-col items-center">
          <div class="mirror">You</div>
          <div class="w-2px h-100px bg-black"></div>
        </div>
      </Html> </TresMesh
    >/
    <TresMesh :position="[0, 1, -20]" v-if="trigger > 0">
      <TresBoxGeometry :args="[1, 1, 1]" />
      <TresMeshStandardMaterial color="gray" transparent :opacity="0" />
      <Html center transform>
        <div class="mt--120px flex flex-col items-center">
          <div>Front</div>
          <div class="w-2px h-100px bg-gray"></div>
        </div>
      </Html>
    </TresMesh>
    <TresAmbientLight :intensity="3" />
    <TresDirectionalLight :position="[2, 2, 2]" :intensity="1" />
    <TresGridHelper v-if="grid" :args="[45, 10]" :scale="[1, 1, 0.8]" />
  </TresCanvas>
  <div
    v-show="controller"
    class="fixed top-0 right-0 flex flex-row mr-1 children:text-20px children:mt-1"
  >
    <div class="flex flex-col mr-1 children:text-20px children:mt-1">
      <div>Animations</div>
      <button @click="flyToStart()">flyToStart</button>
      <button @click="flyToCochonetteAndBack()">flyToCochonetteAndBack</button>
      <button @click="flyThroughCochonetteToTheEndless()">
        flyThroughCochonetteToTheEndless
      </button>
      <button @click="startCircularRotation()">startCircularRotation</button>
      <button @click="flyToRealisticStart()">flyToRealisticStart</button>
    </div>
    <div class="flex flex-col mr-1 children:text-20px children:mt-1">
      <div>Cameras</div>
      <button @click="topCamera()">topCamera</button>
      <button @click="halfCamera()">halfCamera</button>
      <button @click="frontCamera()">frontCamera</button>
    </div>
    <div class="flex flex-col mr-1 children:text-20px children:mt-1">
      <div>Controls</div>
      <div class="flex">
        <input
          type="checkbox"
          name="test"
          id="test"
          v-model="cochonetteSound"
        />
        <label for="test">cochonetteSound</label>
      </div>
    </div>
    <div class="flex flex-col mr-1 children:text-20px children:mt-1">
      <div>Debug</div>
      <button @click="trigger++">reloadSounds</button>
      <button @click="killTweens()">killTweens</button>
      <button @click="clearIntervals()">clearIntervals</button>
    </div>
  </div>
  <div
    v-if="trigger < 1"
    class="w-screen h-screen bg-white fixed top-0 left-0 flexCenter"
  >
    <div @click="trigger++" class="text-black text-80px">START</div>
  </div>
</template>

<script setup>
import { TresCanvas } from "@tresjs/core";
import { Html, PositionalAudio } from "@tresjs/cientos";
import { gsap } from "gsap";

const supabase = useSupabaseClient();
let channel = supabase.channel("xr-controller");

const boules = ref([])
channel
  .on("broadcast", { event: "intersections" }, (event) => {
    boules.value = [];
    console.log("payload received: ", event.payload);

    // Find the cochonette's position
    let cochonette = event.payload.find(item => item.class === "cochonette");
    let offsetX = 0;
    let offsetY = 0;

    if (cochonette) {
      offsetX = cochonette.x * 30;
      offsetY = cochonette.z * 30;
    }

    event.payload.forEach((item) => {
      let boule = {
        x: (item.x * 30) - offsetX,
        y: (item.z * 30) - offsetY,
        color: "yellow",
        size: 1,
        player: 3,
      };

      if (item.class === "cochonette") {
        boule.color = "red";
        boule.size = 0.4;
        boule.player = 0;
      } else if (item.class === "dark") {
        boule.color = "blue";
        boule.player = 1;
      } else if (item.class === "light") {
        boule.color = "black";
        boule.player = 2;
      }

      boules.value.push(boule);
    });
  })
  .subscribe();

const gl = {
  // clearColor: "transparent",
  shadows: true,
  alpha: true,
  windowSize: true,
};

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



const player1shoots = new Audio("/sounds/elevenlabs/x.mp3");
const player2shoots = new Audio("/sounds/elevenlabs/x.mp3");
const player1wins = new Audio("/sounds/elevenlabs/x.mp3");

//interface controls
const trigger = ref(0);
const cochonetteSound = ref(false);
watch(cochonetteSound, () => {
  console.log("chocho");
  trigger.value++;
});

const helpers = ref(true);
const grid = ref(true);
const controller = ref(true);

onKeyStroke("g", (e) => {
  e.preventDefault();
  grid.value = !grid.value;
});
onKeyStroke("q", (e) => {
  e.preventDefault();
  helpers.value = !helpers.value;
});

onKeyStroke("o", (e) => {
  e.preventDefault();
  controller.value = !controller.value;
});

onKeyStroke("x", (e) => {
  e.preventDefault();
  for (let i = 0; i < 6; i++) {
    goToNext();
  }
  halfCamera();
  setTimeout(() => {
    startCircularRotation();
  }, 3500);
});

// camera controls / animations
const alpha = ref(0);
const rotationX = ref(0);
const cameraZ = ref(20);
const cameraX = ref(0);
const cameraY = ref(1);

onKeyStroke("t", (e) => {
  e.preventDefault();
  topCamera();
});

onKeyStroke("h", (e) => {
  e.preventDefault();
  halfCamera();
});

onKeyStroke("f", (e) => {
  e.preventDefault();
  frontCamera();
});

onKeyStroke("c", (e) => {
  e.preventDefault();
  startCircularRotation();
});

onKeyStroke("s", (e) => {
  e.preventDefault();
  flyToStart();
});

onKeyStroke("e", (e) => {
  e.preventDefault();
  flyToRealisticStart();
});


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
    value: 20,
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

function killTweens() {
  frontCamera();
  gsap.killTweensOf([alpha, cameraX, cameraZ]);
  clearIntervals();
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

function flyToStart() {
  killTweens();
  gsap.to(cameraX, {
    value: 0,
    duration: 2,
    ease: "power2.out",
  });
  gsap.to(cameraZ, {
    value: 50,
    duration: 2,
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
  }
  if (intervalIdPlayer) {
    clearInterval(intervalIdPlayer);
  }
}

function startCircularRotation() {
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
    duration: 10,
    delay: 1,
    repeat: -1, // Infinite repetition
    ease: "none",
    onStart: () => {
      const audio1 = new Audio("/strudel/hh.mp3");
      const audio2 = new Audio("/strudel/hh2.mp3");

      console.log("startCircularRotation");
      intervalIdFront = setInterval(() => {
        console.log("looking to front");
        audio1.play();
      }, 10000);
      setTimeout(() => {
        audio2.play();
        intervalIdPlayer = setInterval(() => {
          console.log("looking at player");
          audio2.play();
        }, 10000);
      }, 5000);
    },
    onRepeat: () => {
      flyToRealisticStart();
    },
    onComplete: () => {
      clearIntervals();
    },
  });
}

setTimeout(() => {
  gsap.to(cameraZ, {
    value: 20.001,
    duration: 1,
    ease: "power1.out",
  });
}, 200);
</script>

<style>
.mirror {
  transform: scaleX(-1);
}
</style>
