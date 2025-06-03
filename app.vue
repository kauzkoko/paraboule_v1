<template>
  <div @touchstart="logActivity">
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
const store = useProtoStore();
let inactivityTimer = null;
let inactivityTimeInSeconds = 120

const handleInactivity = () => {
  // console.log(`No activity for ${inactivityTimeInSeconds} seconds - running inactivity function`);
  store.infoScreen = true
};

const resetInactivityTimer = () => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  inactivityTimer = setTimeout(handleInactivity, inactivityTimeInSeconds * 1000); // 60 seconds
};

const logActivity = () => {
  // console.log("click");
  resetInactivityTimer();
};

onMounted(() => {
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };

  window.addEventListener('contextmenu', e => e.preventDefault());

  resetInactivityTimer();
});

onUnmounted(() => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
});
</script>

<style>
:root {
  --info-background: white;
  --red: #ff0000;
  --red-light: #ff4b4b;
  --blue: #616BFF;
  --green: #00ff00;
  --yellow: #ffff00;
  --purple: #800080;
  --orange: #ffa500;
  --pink: #ffc0cb;
  --gray: #808080;
  --white: #ffffff;
  --black: #000000;

  --foreground: var(--white);
  --primary: var(--red);
  --stroke: var(--white);
  --light: var(--#696969);
  --dark: var(--#bebebe);
  --cochonnet: var(--yellow);

  --background: var(--black);

  --svg-color: var(--red);


  --grid-cell: #ff0000;
  --grid-section: #ff0000;
  --grid-isTouchingHaptic: blue;
  --border-color-light: rgba(255, 255, 255, 1);
  --center-circle-shadow: var(--black);
  --center-circle-border: var(--black);
  --center-circle-background: var(--white);
  --border-width: 3px;

  --border-color-light: #666;
  --border-color: var(--red);
  /* --border-color: var(--border-color-light); */
}


html,
body {
  background-color: var(--background);
  margin: 0;
  padding: 0;
  /* font-family: "HelveticaNeue-Light", "Helvetica Neue Light", Helvetica, "Trebuchet MS", Verdana, sans-serif; */
  font-weight: 300;
  overflow: hidden;
  /* overscroll-behavior-y: contain; */
  /* font-family: "TwCenMTPro"; */
  font-family: 'Atkinson Hyperlegible Next', sans-serif;
  user-select: none;
  overscroll-behavior: none
}

button {
  background-color: white;
  color: black;
  border: none;
  padding: 10px;
  border-radius: 5px;
}

input,
textarea,
select {
  font-size: 16px;
  /* Avoid iOS zooming */
}

img {
  -webkit-user-drag: none;
  user-drag: none;
}
</style>