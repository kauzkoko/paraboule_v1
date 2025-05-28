<template>
    <div>
        <video ref="video1Ref" v-show="videoCycler.state.value == videoSrcs[0]" @click="playByNumber(1)" />
        <video ref="video2Ref" v-show="videoCycler.state.value == videoSrcs[1]" @click="playByNumber(2)" />
        <video ref="video3Ref" v-show="videoCycler.state.value == videoSrcs[2]" @click="playByNumber(3)" />
        <video ref="video4Ref" v-show="videoCycler.state.value == videoSrcs[3]" @click="playByNumber(4)" />
        <video ref="video5Ref" v-show="videoCycler.state.value == videoSrcs[4]" @click="playByNumber(5)" />
        <video ref="video6Ref" v-show="videoCycler.state.value == videoSrcs[5]" @click="playByNumber(6)" />
        <video ref="video7Ref" v-show="videoCycler.state.value == videoSrcs[6]" @click="playByNumber(7)" />
        <div class="text-white fixed bg-black text-30px">
            <div>video number {{ videoCycler.index.value + 1 }}</div>
        </div>
    </div>
</template>

<script setup>
const video1Ref = useTemplateRef('video1Ref')
const video2Ref = useTemplateRef('video2Ref')
const video3Ref = useTemplateRef('video3Ref')
const video4Ref = useTemplateRef('video4Ref')
const video5Ref = useTemplateRef('video5Ref')
const video6Ref = useTemplateRef('video6Ref')
const video7Ref = useTemplateRef('video7Ref')

const videoSrcs = [
    '/bahn/1.mov',
    '/bahn/2.mov',
    '/bahn/3.mov',
    '/bahn/4.mov',
    '/bahn/5.mov',
    '/bahn/6.mov',
    '/bahn/7.mov',
]
const videoCycler = useCycleList(videoSrcs)

const { playing: playing1, currentTime: currentTime1, duration: duration1, volume: volume1 } = useMediaControls(video1Ref, {
    src: '/bahn/1.mov',
})
const { playing: playing2, currentTime: currentTime2, duration: duration2, volume: volume2 } = useMediaControls(video2Ref, {
    src: '/bahn/2.mov',

})
const { playing: playing3, currentTime: currentTime3, duration: duration3, volume: volume3 } = useMediaControls(video3Ref, {
    src: '/bahn/3.mov',
})
const { playing: playing4, currentTime: currentTime4, duration: duration4, volume: volume4 } = useMediaControls(video4Ref, {
    src: '/bahn/4.mov',
})
const { playing: playing5, currentTime: currentTime5, duration: duration5, volume: volume5 } = useMediaControls(video5Ref, {
    src: '/bahn/5.mov',
})
const { playing: playing6, currentTime: currentTime6, duration: duration6, volume: volume6 } = useMediaControls(video6Ref, {
    src: '/bahn/6.mov',
})
const { playing: playing7, currentTime: currentTime7, duration: duration7, volume: volume7 } = useMediaControls(video7Ref, {
    src: '/bahn/7.mov',
})

onKeyStroke(["p"], () => {
    videoCycler.prev();
});

onKeyStroke("n", () => {
    videoCycler.next();
    // console.log(videoCycler.index.value)
    // if (videoCycler.index.value > 0) {
    //     videos[videoCycler.index.value - 1].currentTime = 0;
    // } else {
    //     videos[videos.length - 1].currentTime = 0;
    // }
});

const playNextVideo = () => {
    videoCycler.next();
    playByNumber(videoCycler.index.value + 1);
}

const playByNumber = (number) => {
    if (number === 1) {
        playing1.value = true
        currentTime7.value = 0
    }
    if (number === 2) {
        playing2.value = true
        currentTime1.value = 0

    }
    if (number === 3) {
        playing3.value = true
        currentTime2.value = 0
    }
    if (number === 4) {
        playing4.value = true
        currentTime3.value = 0
    }
    if (number === 5) {
        playing5.value = true
        currentTime4.value = 0
    }
    if (number === 6) {
        playing6.value = true
        currentTime5.value = 0
    }
    if (number === 7) {
        playing7.value = true
        currentTime6.value = 0
    }
}

useExhibitionController();
const bus = useEventBus("protoboules");
bus.on((message, payload) => {
    if (message === "shootFilmBoule") {
        console.log("shootFilmBoule")
        playNextVideo()
    }
});
</script>

<style scoped>
video {
    @apply fixed left-0 top-0 w-full h-full object-cover;
}
</style>