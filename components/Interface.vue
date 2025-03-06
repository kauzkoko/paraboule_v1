<template>
  <div
    class="w-100dvw h-dvh flex bg-black justify-center items-center overflow-hidden select-none fixed left-0 top-14px"
    ref="el"
  >
    <div class="container">
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
.container {
  width: 100%;
  height: calc(100% - 38px);
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
