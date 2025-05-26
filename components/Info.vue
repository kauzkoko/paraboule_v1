<template>
    <div class="info-container" :class="{ 'pointer-events-none': infoButton }">
        <div class="info-button" v-if="infoButton" @click="infoButton = !infoButton">
            <h1>i</h1>
        </div>
        <div class="info-large" v-else @click="infoButton = !infoButton">
            <h1>Info</h1>
            <p>Irgend ein text</p>
            <div class="info-close">CLOSE</div>
        </div>
    </div>
</template>

<script setup lang="ts">
const infoButton = ref(true);
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
    /* mix-blend-mode: difference; */
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
    justify-content: center;
    flex-direction: column;
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    padding: 2rem;
    z-index: 1000;
    box-shadow: 0px 0px 35px 14px #F00 inset;
    pointer-events: auto;

    h1 {
        font-size: 4rem;
        margin: 0;
    }

    p {
        margin: 0;
        padding: 1rem;
        font-size: 2rem;
        padding-bottom: 2rem;
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