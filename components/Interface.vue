<template>
  <div class="outer" ref="el"  :style="{ top: xrRunning ? '8px' : '4px'}">
    <div class="container" :style="{ height: xrRunning ? '900px' : '886px'}">
      <div class="grid-item" @click="scanCamera()">
        <img src="/icons/scancamera.png" />
      </div>
      <div class="grid-item" @click="ping()">
        <img src="/icons/ping.png" />
      </div>
      <div class="grid-item">
        <img src="/icons/aroundcocho.png" />
      </div>
      <div class="grid-item">
        <img src="/icons/flythrough.png" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  xrRunning: {
    type: Boolean,
    required: true
  }
});

const el = ref(null);
watch(() => props.xrRunning, (newVal) => {
  if (newVal) {
    el.value.style.opacity = '0';
    setTimeout(() => {
      el.value.style.opacity = '.5';
    }, 500);
  }
});


const emit = defineEmits(["scanCamera"]);

const scanCamera = () => {
  emit("scanCamera");
};

const { sendPlay } = useSoundController();

const ping = () => {
  console.log("ping");
  sendPlay();
};
</script>

<style>
.outer {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  background-color: black;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  user-select: none;
  position: fixed;
  left: 0;
  transition: opacity 100ms;
}

.container {
  width: 100%;
  padding: 5px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 5px 5px;
  grid-auto-flow: row;
  grid-template-areas:
    ". ."
    ". .";
  user-select: none;
}

.grid-item {
  border: 3px solid #ff0000;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  pointer-events: auto;
  img {
    pointer-events: none;
    width: 90px;
  }
}
</style>
