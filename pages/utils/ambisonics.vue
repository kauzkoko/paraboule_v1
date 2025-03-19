<template>
  <TresCanvas window-size clear-color="white">
    <TresPerspectiveCamera
      :position="[cameraX, cameraY, cameraZ]"
      :rotation="[rotationX, (alpha * Math.PI) / 180, 0]"
    />
    <TresMesh
      v-for="(boule, index) in boules"
      :position="[boule.x, 0, boule.z]"
      :key="index"
    >
      <TresSphereGeometry :args="[boule.size, 24, 24]" />
      <TresMeshPhysicalMaterial
        :roughness="0.4"
        :metalness="1"
        :emissive="boule.color"
      />
    </TresMesh>
    <TresAmbientLight :intensity="100" />
    <TresDirectionalLight />
    <Grid />
  </TresCanvas>
  <div
    class="fullScreen bg-black fixed left-0 top-0"
    v-show="isBlackScreen"
  ></div>
  <div class="fixed left-0 top-0 p-3 text-80px">
    <div :class="[isBlackScreen ? 'text-white' : 'text-black']">
      Step: {{ cycler.index.value + 1 }}
    </div>
  </div>
  <div class="fixed bottom-0 left-0 p-3">
    <img :src="qrcode" class="w-15vw" alt="QR Code" />
  </div>
  <div class="fixed bottom-0 right-0 p-3">
    <button @click="lastBoules()" class="mr-1">Last step</button>
    <button @click="changeBoules()" class="mr-1">Next step</button>
    <button @click="moveBoules()" class="mr-1">Start animation</button>
    <button @click="toggleBlackScreen()">Toggle black screen</button>
  </div>
</template>

<script setup>
import gsap from "gsap";
import { TresCanvas } from "@tresjs/core";
import { Grid } from "@tresjs/cientos";
import { useQRCode } from "@vueuse/integrations/useQRCode";

const qrcode = useQRCode("https://protoboules.netlify.app/poll", {
  margin: 0,
});

const { send } = useOSC();

const isBlackScreen = ref(false);
const toggleBlackScreen = useToggle(isBlackScreen);

watch(isBlackScreen, (newVal) => {
  console.log(newVal);
});

let startPoint = 30;
const alpha = ref(0);
const rotationX = ref(0);
const cameraX = ref(0);
const cameraY = ref(0);
const cameraZ = ref(startPoint);
const scaler = 1;
const xScaler = 5;
const zScaler = 5;

const store = useProtoStore();
const { boulesToDisplay } = storeToRefs(store);

const boules1 = [
  {
    x: 0,
    y: 0,
    z: 0,
    class: "cochonet",
    color: "red",
    size: 0.3,
  },
  {
    x: 4,
    y: 0,
    z: 2,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
  {
    x: 2,
    y: 0,
    z: -3,
    class: "light",
    color: "green",
    size: 0.8,
  },
];

const boules2 = [
  {
    x: 0,
    y: 0,
    z: 0,
    class: "cochonet",
    color: "red",
    size: 0.3,
  },
  {
    x: 2,
    y: 0,
    z: 2,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
  {
    x: -3,
    y: 0,
    z: 2,
    class: "light",
    color: "green",
    size: 0.8,
  },
];

const boules3 = [
  {
    x: 0,
    y: 0,
    z: 0,
    class: "cochonet",
    color: "red",
    size: 0.3,
  },
  {
    x: 4,
    y: 0,
    z: -1,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
  {
    x: 1,
    y: 0,
    z: -2,
    class: "light",
    color: "green",
    size: 0.8,
  },
  {
    x: -1,
    y: 0,
    z: 1,
    class: "light",
    color: "green",
    size: 0.8,
  },
];

const boules4 = [
  {
    x: 0,
    y: 0,
    z: 0,
    class: "cochonet",
    color: "red",
    size: 0.3,
  },
  {
    x: 3,
    y: 0,
    z: -3,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
  {
    x: 2,
    y: 0,
    z: 0,
    class: "light",
    color: "green",
    size: 0.8,
  },
  {
    x: -3,
    y: 0,
    z: 2,
    class: "light",
    color: "green",
    size: 0.8,
  },
];

const boules5 = [
  {
    x: 0,
    y: 0,
    z: 0,
    class: "cochonet",
    color: "red",
    size: 0.3,
  },
  {
    x: 2,
    y: 0,
    z: -3,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
  {
    x: -2,
    y: 0,
    z: 0,
    class: "light",
    color: "green",
    size: 0.8,
  },
  {
    x: -3,
    y: 0,
    z: 2,
    class: "light",
    color: "green",
    size: 0.8,
  },
  {
    x: 0,
    y: 0,
    z: -4,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
];

const boules = ref(boules1);
const cycler = useCycleList([boules1, boules2, boules3, boules4, boules5]);

const changeBoules = () => {
  cycler.next();
  boules.value = cycler.state.value;
};

const lastBoules = () => {
  cycler.prev();
  boules.value = cycler.state.value;
};

const mockIntersections = ref([
  {
    x: 0.15217870875827644,
    y: 0.11757755279540989,
    z: 2.14242094133827,
    class: "cochonet",
    color: "red",
    size: 0.3,
  },
  {
    x: 0.3014103032020119,
    y: 0.11757755279540989,
    z: -2.3185530158534984,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
  {
    x: 0.019827494002689575,
    y: 0.13757755279540984,
    z: -1.873205403607142,
    class: "light",
    color: "green",
    size: 0.8,
  },
  {
    x: 0.35239538925638664,
    y: 0.050841178894042934,
    z: -2.040454871744344,
    class: "dark",
    color: "blue",
    size: 0.8,
  },
  {
    x: 0.20640927469181287,
    y: 0.10841178894042956,
    z: -1.9825655394221926,
    class: "light",
    color: "green",
    size: 0.8,
  },
]);

let counter = 0;
const moveBoules = () => {
  counter++;
  boules.value.forEach((boule, index) => {
    console.log(boule);
    const startZ = boule.z;
    const finalZ = boule.z + startPoint;

    const tagX = "ball" + (index + 1) + "x";
    const tagY = "ball" + (index + 1) + "y";
    const tagIndex = "ball" + (index + 1) + "playing";
    send.value(tagIndex, counter);

    let distanceX = boule.x - 0;
    let mappedDistanceX = distanceX / xScaler;
    send.value(tagX, mappedDistanceX);

    let distanceZ = boule.z - startPoint;
    let inverseDistanceZ = distanceZ * -1;
    let mappedDistanceZ = inverseDistanceZ / zScaler;
    gsap.to(boule, {
      z: finalZ,
      duration: 3,
      ease: "power2.out",
      onUpdate: () => {
        console.log(boule.z);
        distanceZ = boule.z - startPoint;
        inverseDistanceZ = distanceZ * -1;
        mappedDistanceZ = inverseDistanceZ / zScaler;
        send.value(tagY, mappedDistanceZ);
      },
      onComplete: () => {
        gsap.to(boule, {
          z: startZ,
          duration: 3,
          ease: "power2.in",
          onUpdate: () => {
            console.log(boule.z);
            distanceZ = boule.z - startPoint;
            inverseDistanceZ = distanceZ * -1;
            mappedDistanceZ = inverseDistanceZ / zScaler;
            send.value(tagY, mappedDistanceZ);
          },
        });
      },
    });
  });
};

onKeyStroke("m", (e) => {
  e.preventDefault();
  moveBoules();
});

onKeyStroke("s", (e) => {
  e.preventDefault();
  setBoules(boulesToDisplay.value);
});

onKeyStroke("t", (e) => {
  e.preventDefault();
  topCamera();
});

onKeyStroke("f", (e) => {
  e.preventDefault();
  frontCamera();
});

onKeyStroke("c", (e) => {
  e.preventDefault();
  changeBoules();
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
    value: 50,
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
    value: 0,
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

topCamera();
frontCamera();
</script>
