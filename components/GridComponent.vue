<template>
  <Grid
    :args="[10.5, 10.5]"
    :cell-color="store.isTouchingHaptic ? color2 : color1"
    :cell-size="1"
    :cell-thickness="0.5"
    :section-color="store.isTouchingHaptic ? color2 : color1"
    :section-size="1"
    :section-thickness="2"
    :infinite-grid="true"
    :fade-from="0"
    :fade-distance="30"
    :fade-strength="1"
  />
</template>

<script setup>
import { Grid } from "@tresjs/cientos";
const store = useProtoStore();
const color1 = useCssVar('--grid-cell')
const color2 = useCssVar('--grid-isTouchingHaptic')
console.log(color1)
</script>
