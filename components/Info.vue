<template>

    <div class="info-container" :class="{ 'pointer-events-none': !store.infoScreen }">
        <div class="info-large" :class="{ 'info-button-glow': infoButtonGlow, 'info-button': !store.infoScreen }">
            <div v-show="!store.infoScreen" class="w-full h-full flex justify-center items-center "
                @click="toggleInfoScreen">
                <div class="text-48px mt--10px">i</div>
            </div>
            <div class="inner-grid text-black!" v-show="store.infoScreen">
                <div class="upper-content">
                    <div v-if="store.infoStepper.isCurrent('role')">
                        <h1
                            v-html="store.infoStepper.current[store.modesCycler.state.name === 'S1' || store.modesCycler.state.name === 'S2' || store.modesCycler.state.name === 'S3' ? store.modesCycler.state.name : 'Empty'].title">
                        </h1>

                        <p
                            v-html="store.infoStepper.current[store.modesCycler.state.name === 'S1' || store.modesCycler.state.name === 'S2' || store.modesCycler.state.name === 'S3' ? store.modesCycler.state.name : 'Empty'].upperText">
                        </p>
                    </div>
                    <div v-if="store.infoStepper.isCurrent('disclaimer')" class="flex flex-col items-center disclaimer">
                        <h1 v-html="store.infoStepper.current.title" class="border-solid border-3px"></h1>
                        <p class="mt-10px! mb-40px!" v-html="store.infoStepper.current.upperText"></p>
                    </div>
                    <div v-else>
                        <h1 class="text-center" v-html="store.infoStepper.current.title"></h1>
                        <img v-if="store.infoStepper.current.img" :src="store.infoStepper.current.img" />
                        <p class="mt-10px! mb-40px!" v-html="store.infoStepper.current.subtitle"></p>
                    </div>
                </div>
                <div class="lower-content">
                    <div v-if="store.infoStepper.isCurrent('welcome')"
                        class="flex justify-center flex-col items-center">
                        <p class="mt-50px!" v-html="store.infoStepper.current.bottomText"></p>
                        <div class="button-container info-next mb-10px border-hex-00ff00!"
                            @click="nextFunction()"><span class="color-hex-00ff00!">LEARN MORE</span></div>
                    </div>
                    <div v-if="store.infoStepper.isCurrent('role')">
                        <p class="mt--20px!"
                            v-html="store.infoStepper.current[store.modesCycler.state.name === 'S1' || store.modesCycler.state.name === 'S2' || store.modesCycler.state.name === 'S3' ? store.modesCycler.state.name : 'Empty'].bottomText">
                        </p>
                    </div>
                    <div class="" v-if="store.infoStepper.isCurrent('disclaimer')">
                        <p class="mt-10px! mb-40px!" v-html="store.infoStepper.current.bottomText"></p>
                    </div>
                    <div v-if="store.infoStepper.isCurrent('center-circle')" class="mt--10px!">
                        <!-- <DoubleTap />
                        <p class="mt--5px! mb-10px!">DOUBLE TAP to mute audio.</p> -->
                        <Up class="mt--10px!" />
                        <p class="mt--5px! mb-10px!">SWIPE UP to adopt the cochonnet’s point of view.</p>
                        <p class="mb-10px!">
                            <Left class="transform translate-y-5px mr-10px" />
                            <span>SWIPE LEFT or RIGHT</span>
                            <Right class="transform translate-y-5px ml-10px" /><br>
                            to switch pages.
                        </p>
                        <p class="mb--10px!">SWIPE DOWN to return to starting point perspective.</p>
                        <Down />
                    </div>
                    <div v-if="store.infoStepper.isCurrent('functions')" class="mt--10px!">
                        <Dot class="mix-blend-difference" />
                        <p class="mt--5px! mb-10px!">TAP once to run the function of the button. Depending on the
                            function you receive feedback in the app or on the TV screens.</p>
                        <LongPress class="mix-blend-difference" />
                        <p class="mt--5px! mb-10px!">PRESS and HOLD to hear an explanation of the function. RELEASE to
                            stop.
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="!store.infoStepper.isCurrent('welcome')"
            class="fixed z-1000 bottom-48px left-50dvw transform translate-x--50% flex justify-center children:mx-30px mix-blend-difference">
            <div class="button-container info-back" :class="{ 'color-white!': !store.infoStepper.isCurrent('welcome') }"
                @click="store.infoStepper.goToPrevious()">BACK</div>
            <div class="button-container info-next"
                :class="{ 'color-white!': !store.infoStepper.isCurrent('welcome') && !store.infoStepper.isLast, 'start-button': store.infoStepper.isLast }"
                @click="store.infoStepper.isLast ? close() : nextFunction()">{{
                    store.infoStepper.isLast ? 'START' : 'NEXT' }}</div>

        </div>
        <div v-if="store.infoScreen"
            class="fixed z-1000 top-28px left-50dvw transform translate-x--50% flex justify-center">
            <div class="button-container info-close" @click="close()">CLOSE</div>
        </div>
    </div>
</template>


<script setup lang="ts">
import 'animate.css';
const store = useProtoStore();

const infoButtonGlow = ref(false);

setInterval(() => {
    if (!store.infoScreen) {
        infoButtonGlow.value = !infoButtonGlow.value;
        setTimeout(() => {
            infoButtonGlow.value = !infoButtonGlow.value;
        }, 2000);
    }
}, 5000);

let counter = 3;
setInterval(() => {
    if (store.infoStepper.isCurrent('functions')) {
        store.buttonTransition = !store.buttonTransition;
        store.buttonTransitionIndex = counter % 4;
        counter = counter + .5;
    }
}, 4000);

const toggleInfoScreen = () => {
    if (store.infoScreen) {
        close();
    } else {
        store.infoScreen = true;
    }
}

const nextFunction = () => {
    store.infoStepper.goToNext();
    // store.unmute3dAudio();
}

const computedTransition = computed(() => {
    return 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
});

// store.infoStepper.goTo('functions');
const close = () => {
    // please uncomment this before exhibition
    store.unmute3dAudio();
    setTimeout(() => {
        // store.setIntersectionsByNumber(1);
    }, 1000)
    // store.toggle3dAudio();
    // console.log('close');
    store.infoScreen = false;
    store.infoStepper.goTo('welcome');
    // console.log(store.infoScreen);
}
</script>

<style scoped>
.info-large {
    position: absolute;
    bottom: 50%;
    left: 50%;

    transform: translate(-50%, 50%);

    width: 170dvw;
    height: 170dvw;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: var(--info-background);
    color: var(--black);
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    padding: 2rem;
    z-index: 1000;
    box-shadow: 0px 4px 38.4px 22px #616BFF inset, 6px 20px 119.6px 52px #FFF inset;
    border: var(--border-width) solid var(--white);
    transition: box-shadow .3s ease-in-out;

    .inner-grid {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr;
    }

    p {
        margin: 0;
        padding: 0;
        font-size: 24px;
        font-weight: 500;
        max-width: 90dvw;
    }

    .upper-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        div {
            /* margin-top: 112px; */

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
    }
}

.info-button {

    position: absolute;
    left: 50%;
    top: 100%;

    transform: translate(-50%, -60%);

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
    background: linear-gradient(180deg, #F00 0%, rgb(84, 0, 0) 100%);
    /* border: var(--border-width) solid var(--white); */
    color: black;
    font-weight: bold;
    font-size: 2rem;
    z-index: 1000;
    /* mix-blend-mode: exclusion; */
    padding: 0;
    margin: 0;
    border-color: black;


    transition: v-bind(computedTransition);
}

.start-button {
    /* background-color: var(--white); */
    color: var(--green) !important;
    border: 3px solid var(--green) !important;
}

.info-button-glow {
    box-shadow: 0px 0px 20px 3px #FFF inset;
    color: white;
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

.button-container {
    padding: 6px 6px;
    border-radius: 10px;
    border-style: solid;
    border-width: 3px;
    font-weight: 500;
    text-transform: uppercase;
    width: fit-content;
    font-size: 32px;
    font-weight: 500;
    /* mix-blend-mode: difference; */
}

.info-next {
    margin-top: 40px;
    border-color: var(--green);
    color: var(--green) !important;
}

.info-back {
    margin-top: 40px;
    border-color: var(--white);
    color: var(--black);
}

.disclaimer {
    h1 {
        @apply: color-hex-ff0000 ! w-fit text-center px-3 border-solid border-red;
        border-radius: 10px;
    }

    color: red !important;

}

.info-close {
    color: var(--red);
}
</style>

<style>
.important {
    color: var(--red) !important;
}
</style>