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
  --red: #ff0000;
  --blue: #0000ff;
  --green: #00ff00;
  --yellow: #ffff00;
  --purple: #800080;
  --orange: #ffa500;
  --pink: #ffc0cb;
  --gray: #808080;
  --white: #ffffff;
  --black: #000000;
  --background: var(--black);
  --foreground: var(--white);
  --primary: var(--red);
  --stroke: var(--white);
  --light: var(--#696969);
  --dark: var(--#bebebe);
  --cochonet: var(--yellow);
}


html,
body {
  background-color: var(--background);
  margin: 0;
  padding: 0;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", Helvetica, "Trebuchet MS", Verdana, sans-serif;
  font-weight: 300;
  overflow: hidden;
  overscroll-behavior-y: contain;

  font-family: "TwCenMTPro";
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