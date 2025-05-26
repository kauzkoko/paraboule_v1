<template>
  <div>
    <NuxtPwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
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
  --cochonet: var(--yellow);

  --background: var(--black);
  --border-color: var(--red);
  --svg-color: var(--red);


  --grid-cell: #ff0000;
  --grid-section: #ff0000;
  --grid-isTouchingHaptic: blue;
  --border-color-light: rgba(255, 255, 255, 1);
  --center-circle-shadow: var(--black);
  --center-circle-border: var(--black);
  --center-circle-background: var(--white);
  --border-width: 5px;
}


html,
body {
  background-color: var(--background);
  margin: 0;
  padding: 0;
  /* font-family: "HelveticaNeue-Light", "Helvetica Neue Light", Helvetica, "Trebuchet MS", Verdana, sans-serif; */
  font-weight: 300;
  overflow: hidden;
  overscroll-behavior-y: contain;
  /* font-family: "TwCenMTPro"; */
  font-family: 'Atkinson Hyperlegible Next', 'AtkinsonHyperlegibleNext', 'Atkinson Hyperlegible', sans-serif;
  font-style: normal;
  font-stretch: normal;
  font-weight: 500;
}

button {
  background-color: white;
  color: black;
  border: none;
  padding: 10px;
  border-radius: 5px;
}
</style>