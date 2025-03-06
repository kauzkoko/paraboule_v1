<template>
  <div
    class="w-100dvw h-dvh flex bg-black justify-center items-center overflow-hidden select-none"
    ref="el"
  >
    <div class="container">
      <template v-if="page % 2 == 0">
        <div class="grid-item" ref="htmlRefHook">
          <img src="/icons/flythrough.png" />
        </div>
        <div class="grid-item">
          <img src="/icons/northsouth.png" />
        </div>
        <div class="grid-item">
          <img src="/icons/aroundcocho.png" />
        </div>
        <div class="grid-item">
          <img src="/icons/scancamera.png" />
        </div>
      </template>
      <template v-if="page % 2">
        <div class="grid-item" @click="ping()">
          <img src="/icons/ping.png" />
        </div>
        <div class="grid-item">
          <img src="/icons/aroundcocho.png" />
        </div>
        <div class="grid-item">
          <img src="/icons/flythrough.png" />
        </div>
        <div class="grid-item">
          <img src="/icons/northsouth.png" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient();
let soundController = supabase.channel("sound-controller");
soundController.subscribe();
// test
const el = useTemplateRef("el");
const { isSwiping, direction } = useSwipe(el);

const page = ref(0);
watch(isSwiping, (val) => {
  if (val) {
    console.log(direction.value);
    page.value++;
  }
});

const htmlRefHook = ref(null);
onLongPress(
  htmlRefHook,
  () => {
    console.log("long press");
    page.value++;
  },
  {
    modifiers: {
      prevent: true,
    },
  }
);

const ping = () => {
  console.log("ping");
  page.value++;
  soundController.send({
    type: "broadcast",
    event: "play",
  });
};
</script>

<style>
.container {
  width: 100%;
  height: calc(100% - 10px);
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
  img {
    pointer-events: none;
  }
}
</style>
