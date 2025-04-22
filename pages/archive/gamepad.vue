<template>
  <div>
    <h1>Gamepad</h1>
    <div>
      <button @click="vibrateLeft">Vibrate Left</button>
      <input type="range" v-model="leftDuration" min="100" max="2000" />
    </div>

    <div>
      <button @click="vibrateRight">Vibrate Right</button>
      <input type="range" v-model="rightDuration" min="100" max="2000" />
    </div>
  </div>
</template>

<script setup>
const { gamepads } = useGamepad();
const gamepad = ref(null);
const leftDuration = ref(0);
const rightDuration = ref(0);

function vibrateLeft() {
  gamepad.value = gamepads.value[0];
  if (gamepad.value.hapticActuators.length > 0) {
    const actuator = gamepad.value.hapticActuators[0];
    actuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: leftDuration.value,
      weakMagnitude: 0,
      strongMagnitude: 1,
    });
  }
}

function vibrateRight() {
  gamepad.value = gamepads.value[0];
  if (gamepad.value.hapticActuators.length > 0) {
    const actuator = gamepad.value.hapticActuators[0];
    actuator.playEffect("dual-rumble", {
      startDelay: 0,
      duration: rightDuration.value,
      weakMagnitude: 1,
      strongMagnitude: 0,
    });
  }
}
</script>
