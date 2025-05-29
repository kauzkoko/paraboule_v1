<template>
    <div :class="{ 'blink': isBlinking }">
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
} = useExhibitionController();

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

const isBlinking = ref(false)

onMounted(() => {
    currentTime.value = 60
    
    // Set up blinking every 5 seconds
    setInterval(() => {
        isBlinking.value = true
        setTimeout(() => {
            isBlinking.value = false
        }, 200) // Blink duration of 200ms
    }, 5000) // Every 5 seconds
})

onKeyStroke('p', () => {
    playing.value = !playing.value
    console.log('space')
})

const rotation = ref(0)
onKeyStroke('r', () => {
    rotation.value += 180
})
const computedRotation = computed(() => {
    return `rotate(${rotation.value}deg)`
})

const mirror = ref(false)
onKeyStroke('m', () => {
    mirror.value = !mirror.value
})
const computedMirror = computed(() => {
    return mirror.value ? 'scaleY(-1)' : 'scaleY(1)'
})

const computedTransform = computed(() => {
    return `${computedRotation.value} ${computedMirror.value}`
})

</script>

<style scoped>
video {
    transform: v-bind(computedTransform);
}

.blink {
    animation: blink-animation 0.2s ease-in-out;
}

@keyframes blink-animation {
    0% { opacity: 1; }
    50% { opacity: 0.3; }
    100% { opacity: 1; }
}
</style>