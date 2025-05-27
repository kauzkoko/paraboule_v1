<template>
    <div class="info-container" :class="{ 'pointer-events-none': infoButton }">
        <div class="info-button" v-if="infoButton" @click="infoButton = !infoButton" :class="{ 'info-button-glow': infoButtonGlow }">
            <h1>i</h1>
        </div>
        <div class="info-large" v-else @click="infoButton = !infoButton">
            <h1>{{ current.title }}</h1>
            <img v-if="current.img" :src="current.img" class="w-90dvw" />
            <p>{{ current.text }}</p>
            <div class="info-buttons"></div>

            <div v-if="isLast" class="info-close" @click="infoButton = !infoButton">CLOSE</div>
            <div v-else class="info-next" @click="goToNext">NEXT</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const infoButton = ref(true);
const infoButtonGlow = ref(false);

setInterval(() => {
    infoButtonGlow.value = !infoButtonGlow.value;
    setTimeout(() => {
        infoButtonGlow.value = !infoButtonGlow.value;
    }, 2000);
}, 5000);

const {
  steps,
  stepNames,
  index,
  current,
  next,
  previous,
  isFirst,
  isLast,
  goTo,
  goToNext,
  goToPrevious,
  goBackTo,
  isNext,
  isPrevious,
  isCurrent,
  isBefore,
  isAfter,
} = useStepper({
  'welcome': {
    title: 'Welcome to',
    img: '/icons/parabouleBlackScript.svg',
    text: 'PARABOULE assists you in playing Pétanque by providing spatial audio and haptic feedback and is built to be used blindly.',
  },
  'center-circle': {
    title: 'Center Circle',
    text: 'Use the center circle to navigate in the app. Swipe left and right to change the page. Swipe up to mute/unmute the audio. Swipe down to return to the startpoint camera perspective.',
  },
  'functions': {
    title: 'Buttons',
    text: 'Use the buttons to run functions in the app. Tap and hold to listen to the explanation of the function. Tap once to run the function.',
  },
  'payment': {
    title: 'Payment',
  },
})
</script>

<style scoped>
.info-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100dvw;
    height: 100dvh;
    overflow: hidden;
    pointer-events: auto;
    z-index: 1000;
}

.info-button {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: var(--info-background);
    color: var(--black);
    display: flex;
    box-shadow: 0px 0px 20px 3px #F00 inset;
    z-index: 1000;
    pointer-events: auto;
    background: linear-gradient(180deg, #F00 0%, #900 100%);
    /* border: var(--border-width) solid var(--white); */
    mix-blend-mode: difference;
    color: black;
    font-weight: bold;
    font-size: 2rem;
    transition: color 2s ease, box-shadow 2s ease;
}

.info-button-glow {
    box-shadow: 0px 0px 20px 3px #FFF inset;
    color: white;
    transition: color 2s ease, box-shadow 2s ease;
}

.info-large {
    width: 160dvw;
    height: 160dvw;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: var(--info-background);
    color: var(--black);
    display: flex;
    align-items: center;
    /* justify-content: center; */
    flex-direction: column;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    padding: 2rem;
    z-index: 1000;
    pointer-events: auto;
    box-shadow: 0px 4px 38.4px 22px #616BFF inset, 6px 20px 119.6px 52px #FFF inset;
    border: var(--border-width) solid var(--white);
    mix-blend-mode: exclusion;

    h1 {
        font-size: 36px;
        font-weight: 700;
        margin: 0;
        text-transform: uppercase;
    }

    img {
        /* margin-top: 10px; */
    }

    p {
        margin: 0;
        padding: 1rem;
        font-size: 2rem;
        padding-bottom: 2rem;
        max-width: 85dvw;
    }

    /* mix-blend-mode: difference; */

    .info-close {
        padding: 1rem;
        border-radius: 10px;
        border-style: solid;
        mix-blend-mode: normal;
    }
}
</style>