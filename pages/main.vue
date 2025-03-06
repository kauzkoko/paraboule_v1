<template>
  <div>
    <h1>Welcome to Main Page</h1>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let channel = supabase.channel("xr-controller");

channel
  .on("broadcast", { event: "intersections" }, (event) => {
    console.log("received event on vue page: ", event);
    intersections.value = event.payload;
  })
  .subscribe();
</script>

<style scoped>
h1 {
  color: #42b983;
}
</style>
