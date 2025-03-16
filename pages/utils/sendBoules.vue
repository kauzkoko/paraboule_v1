<template>
  <div>
    <div>
      <div
        class="fixed left-50vw top-50vh transform-gpu translate-x--50% translate-y--50%"
      >
        <div class="relative">
          <div
            v-for="(intersection, index) in intersections"
            class="absolute bg-yellow rounded-full aspect-1 w-10px text-10px text-center opacity-50"
            :style="{
              left: intersection.x * 150 + 'px',
              top: intersection.z * 150 + 'px',
            }"
          >
            {{ index }}
          </div>
        </div>
      </div>
      <button @click="send">send random intersections</button>
      <pre>{{ intersections }}</pre>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let channel = supabase.channel("xr-controller");

let fixedIntersections = [
  [
    {
      x: 0.15217870875827644,
      y: 0.11757755279540989,
      z: -2.14242094133827,
      class: "cochonet",
    },
    {
      x: 0.3014103032020119,
      y: 0.11757755279540989,
      z: -2.1185530158534984,
      class: "dark",
    },
    {
      x: 0.29827494002689575,
      y: 0.11757755279540984,
      z: -1.873205403607142,
      class: "light",
    },
    {
      x: 0.35239538925638664,
      y: 0.10841178894042934,
      z: -2.040454871744344,
      class: "dark",
    },
    {
      x: 0.40640927469181287,
      y: 0.10841178894042956,
      z: -1.9825655394221926,
      class: "light",
    },
  ],
  [
    {
      x: 0.266183173694223,
      y: 0.10841178894042958,
      z: -2.0445047020107423,
      class: "cochonet",
    },
    {
      x: 0.35239538925638664,
      y: 0.10841178894042934,
      z: -2.040454871744344,
      class: "dark",
    },
    {
      x: 0.40640927469181287,
      y: 0.10841178894042956,
      z: -1.9825655394221926,
      class: "light",
    },
  ],
];

const intersections = ref(fixedIntersections);
channel
  .on("broadcast", { event: "intersections" }, (event) => {
    console.log("received event on vue page: ", event);
    intersections.value = event.payload;
  })
  .subscribe();

let counter = 0;
let send = () => {
  channel.send({
    type: "broadcast",
    event: "intersections",
    payload: { intersections: fixedIntersections[0] },
  });
  // counter++;
};
</script>
