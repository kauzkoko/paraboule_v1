<template>
    <div>
        <video @click="playing = !playing" ref="video" class="w-full h-full object-cover" loop />
    </div>
</template>

<script setup>
const video = useTemplateRef('video')
const { playing, currentTime, duration, volume } = useMediaControls(video, {
    src: '/film/final.mp4',
})

const {
    shootFilmBoule
} = useAnimationController();

const bus = useEventBus("protoboules");

bus.on((message, payload) => {
    if (message === "playFilm") {
        playing.value = true
    }

    if (message === "stopFilm") {
        playing.value = false
    }
});

// Define the times we want to check for
const checkTimes = [64.5, 114.5]
let lastCheckTime = 0

// Watch for changes in currentTime
watch(currentTime, (newTime) => {
    const currentTimeMs = Date.now()
    // Only check if 5 seconds have passed since last check
    if (currentTimeMs - lastCheckTime >= 5000) {
        // Round to nearest 0.5
        const roundedTime = Math.round(newTime * 2) / 2
        // Check if the current time matches any of our target times
        if (checkTimes.includes(roundedTime)) {
            console.log("now")
            shootFilmBoule()
            lastCheckTime = currentTimeMs
        }
    }
})

onMounted(() => {
    currentTime.value = 60
})
</script>

<style scoped></style>