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
html, body {
  background-color: black;
  margin: 0;
  padding: 0;
  font-family: "HelveticaNeue-Light", "Helvetica Neue Light", Helvetica, "Trebuchet MS", Verdana, sans-serif;
  font-weight: 300;
  overflow: hidden;
  overscroll-behavior-y: contain;
}

button {
  background-color: white;
  color: black;
  border: none;
  padding: 10px;
  border-radius: 5px;
}
</style>