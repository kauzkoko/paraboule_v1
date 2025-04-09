<template>
  <Grid
    :args="[10.5, 10.5]"
    :cell-color="store.isTouchingHaptic ? '#aa0000' : '#ff0000'"
    :cell-size="1"
    :cell-thickness="0.5"
    :section-color="store.isTouchingHaptic ? '#aa0000' : '#ff0000'"
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
</script>
