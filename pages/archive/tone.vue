<template>
  <div class="fullScreen">
    <div class="controls">
      <button @click="play">Play</button>
      <input
        type="range"
        min="0"
        max="360"
        step="10"
        v-model="degreesRef"
        @input="updateListenerOrientation"
      />
      <span>Degrees: {{ degreesRef }}°</span>
    </div>
    <div>
      <div
        class="fixed top-50vh left-50vw transform-gpu translate-x--1/2% translate-y--1/2%"
      >
        <div
          class="circle"
          :style="{
            transform: `translate(${listener.positionX * 10}px,${
              listener.positionZ * 10
            }px) rotateZ(${-degreesRef}deg)`,
          }"
        ></div>
      </div>
      <div
        class="fixed top-50vh left-50vw"
        :style="{
          transform: `translate(${object1.positionX * 10}px,${
            object1.positionZ * 10
          }px)`,
        }"
      >
        O
      </div>
      <div
        class="fixed top-50vh left-50vw"
        :style="{
          transform: `translate(${object2.positionX * 10}px,${
            object2.positionZ * 10
          }px)`,
        }"
      >
        O
      </div>
    </div>
  </div>
</template>

<script setup>
import * as Tone from "tone";
const xRef = ref(0);
const yRef = ref(0);
const { x, y } = useMouse();
watch(x, (newVal) => {
  xRef.value = Math.floor(map(newVal, 0, window.innerWidth, -10, 10));
  panner1.positionX.value = xRef.value;
});

watch(y, (newVal) => {
  yRef.value = Math.floor(map(newVal, 0, window.innerHeight, -10, 10));
  panner1.positionZ.value = yRef.value;
});

const object1 = {
  positionX: -5,
  positionY: 0,
  positionZ: -5,
};

const object2 = {
  positionX: 10,
  positionY: 0,
  positionZ: 5,
};

const listener = ref({
  positionX: 0,
  positionY: 0,
  positionZ: 0,
});

const panner1 = new Tone.Panner3D({
  panningModel: "HRTF",
  positionX: object1.positionX,
  positionY: object1.positionY,
  positionZ: object1.positionZ,
  coneInnerAngle: 360,
  coneOuterAngle: 360,
  coneOuterGain: 0
}).toDestination();

const panner2 = new Tone.Panner3D({
  panningModel: "HRTF",
  positionX: object2.positionX,
  positionY: object2.positionY,
  positionZ: object2.positionZ,
  coneInnerAngle: 360,
  coneOuterAngle: 360,
  coneOuterGain: 0
}).toDestination();

const degreesRef = ref(0);
const updateListenerOrientation = () => {
  setRotation(degreesToRadians(degreesRef.value));
};

const synth = new Tone.Synth().connect(panner1);
const synth2 = new Tone.Synth().connect(panner2);

/**
 * Converts degrees to radians
 * @param {number} degrees - The angle in degrees
 * @return {number} The angle in radians
 */
const degreesToRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

function setRotation(angleRadians) {
  Tone.Listener.forwardX.value = Math.sin(angleRadians);
  Tone.Listener.forwardY.value = 0;
  Tone.Listener.forwardZ.value = -Math.cos(angleRadians);
}

// Tone.Listener.forwardX.value = degreesToRadians(180);
// Tone.Listener.forwardZ.value = degreesToRadians(180);

const play = () => {
  synth.triggerAttackRelease("C4", "10s");
  synth2.triggerAttackRelease("D5", "10s");
};

onKeyStroke("ArrowDown", () => {
  listener.value.positionZ += 1;
  Tone.Listener.positionZ.value = listener.value.positionZ;
});

onKeyStroke("ArrowUp", () => {
  listener.value.positionZ -= 1;
  Tone.Listener.positionZ.value = listener.value.positionZ;
});

onKeyStroke("ArrowLeft", () => {
  listener.value.positionX -= 1;
  Tone.Listener.positionX.value = listener.value.positionX;
});

onKeyStroke("ArrowRight", () => {
  listener.value.positionX += 1;
  Tone.Listener.positionX.value = listener.value.positionX;
});

onKeyStroke("r", () => {
  degreesRef.value = (degreesRef.value + 10) % 360;
  updateListenerOrientation();
});

const computedGradient = computed(() => {
  const rotationValue = degreesRef.value;
  return `conic-gradient(white 10deg, blue ${rotationValue}deg, transparent ${
    rotationValue + 10
  }deg)`;
});

onKeyStroke("p", () => {
  play();
});
</script>

<style scoped>
div {
  color: white;
}

.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: v-bind(computedGradient);
}
</style>
