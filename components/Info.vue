<template>
    <div class="info-button" v-if="infoButton" @click="infoButton = false"
        :class="{ 'info-button-glow': infoButtonGlow }">
        <h1>i</h1>
    </div>
    <div v-else class="info-container" :class="{ 'pointer-events-none': infoButton }">
        <div class="info-large">
            <div class="upper-content">
                <div>
                    <h1 v-html="store.infoStepper.current.title"></h1>
                    <img v-if="store.infoStepper.current.img" :src="store.infoStepper.current.img" />
                </div>
            </div>
            <div class="lower-content">
                <div v-if="store.infoStepper.isCurrent('welcome')"
                    class="mt--40px! flex justify-center flex-col items-center">
                    <div class="info-next mb-10px" @click="store.infoStepper.goToNext">NEXT</div>
                    <p>Tap NEXT to learn more on how<br> to use PARABOULE.</p>
                    <div class="info-close mb-10px mt-20px" @click="close()">CLOSE</div>
                    <p class="color-hex-ff0000">Tap CLOSE to return to the game.</p>

                </div>
                <div v-if="store.infoStepper.isCurrent('center-circle')" class="mt-40px!">
                    <Up />
                    <p class="mt--5px! mb-10px!">Swipe up to mute/unmute audio.</p>
                    <p class="mb-10px!">
                        <Left class="transform translate-y-5px mr-10px" />
                        <span>Swipe left and right</span>
                        <Right class="transform translate-y-5px ml-10px" /><br>
                        to switch pages.
                    </p>
                    <p class="mb--10px!">Swipe down to return to the start.</p>
                    <Down />
                </div>
                <div v-if="store.infoStepper.isCurrent('functions')" class="mt--10px!">
                    <Dot class="mix-blend-difference" />
                    <p class="mt--5px! mb-10px!">TAP once to activate the function..</p>
                    <LongPress class="mix-blend-difference" />
                    <p class="mt--5px! mb-10px!">PRESS and HOLD to hear an explanation of the function. RELEASE to stop.
                    </p>
                </div>
            </div>
            <div v-if="!store.infoStepper.isCurrent('welcome')"
                class="fixed z-1000 bottom-28px left-50dvw transform translate-x--50% flex justify-center">
                <div class="info-next" :class="{ 'color-white!': !store.infoStepper.isCurrent('welcome') }"
                    @click="store.infoStepper.isLast ? close() : store.infoStepper.goToNext()">{{
                        store.infoStepper.isLast ? 'START' : 'NEXT' }}</div>
            </div>
        </div>
        <div v-if="!infoButton && !store.infoStepper.isCurrent('welcome')"
            class="fixed z-1000 top-28px left-50dvw transform translate-x--50% flex justify-center">
            <div class="info-close" @click="close()">CLOSE</div>
        </div>

    </div>
</template>
<style scoped>
.info-button {
    position: fixed;
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
    z-index: 1000;
    mix-blend-mode: exclusion;
}

.info-button-glow {
    box-shadow: 0px 0px 20px 3px #FFF inset;
    color: white;
    transition: color 2s ease, box-shadow 2s ease;
}

.info-container {
    position: fixed;

    top: 0;
    left: 0;

    width: 100dvw;
    height: 100dvh;

    display: flex;
    align-items: center;
    justify-content: center;

    /* overflow: hidden; */
    z-index: 1000;
    mix-blend-mode: exclusion;
}

.info-next {
    margin-top: 40px;
    padding: 6px 6px;
    border-radius: 10px;
    border-style: solid;
    border-width: 3px;
    font-weight: 500;
    width: fit-content;
    /* color: var(--white); */
}


.info-close {
    padding: 6px 6px;
    border-radius: 10px;
    border-style: solid;
    border-width: 3px;
    font-weight: 500;
    text-transform: uppercase;
    width: fit-content;
    color: var(--red);
    font-size: 32px;
    font-weight: 500;
}

.info-large {
    width: 160dvw;
    height: 160dvw;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: var(--info-background);
    color: var(--black);

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;

    /* flex-direction: column; */
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    padding: 2rem;
    z-index: 1000;
    box-shadow: 0px 4px 38.4px 22px #616BFF inset, 6px 20px 119.6px 52px #FFF inset;
    border: var(--border-width) solid var(--white);

    .upper-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div {
            margin-top: 112px;

            h1 {
                font-size: 36px;
                font-weight: bolder;
                /* margin-top: 10px; */
                text-transform: uppercase;
                margin-bottom: 10px;
                mix-blend-mode: normal;
            }

            img {
                width: 84dvw;
                margin-top: -20px;
                min-width: 100px;
                mix-blend-mode: difference;
            }
        }
    }

    .lower-content {
        max-height: 60dvh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        p {
            margin: 0;
            padding: 0;
            font-size: 24px;
            font-weight: 500;
            max-width: 90dvw;
        }
    }
}
</style>

<script setup lang="ts">
const store = useProtoStore();

const infoButton = ref(false);
const infoButtonGlow = ref(false);

setInterval(() => {
    infoButtonGlow.value = !infoButtonGlow.value;
    setTimeout(() => {
        infoButtonGlow.value = !infoButtonGlow.value;
    }, 2000);
}, 5000);

let counter = 0;
setInterval(() => {
    if (store.infoStepper.isCurrent('functions')) {
        store.buttonTransition = !store.buttonTransition;
        if (counter % 3 === 0) store.buttonTransitionIndex = store.buttonTransition ? 0 : 1;
        counter++;
    }
}, 3000);

// goTo('functions');
const close = () => {
    infoButton.value = true;
    store.infoStepper.goTo('welcome');
}
</script>
