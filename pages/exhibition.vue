<template>
    <div class="text-white">
        <h1>HOW TO UNPIN/RESTART/PIN THE SMARTPHONES</h1>
        <div class="max-w-screen-lg mx-auto p-1">
            <div>
                <h2>Smartphone 1 - THE SHOT</h2>
                <video src="/videos/s1.mp4" autoplay muted loop controls playsinline></video>
            </div>
            <div>
                <h2>Smartphone 2 - ORIENTATION</h2>
                <video src="/videos/s2.mp4" autoplay muted loop controls playsinline></video>
            </div>

            <div>
                <h2>Smartphone 3 - THE VAR</h2>
                <video src="/videos/s3.mp4" autoplay muted loop controls playsinline></video>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

</script>

<style>
html, body {
    background-color: #000;
    overflow-y: scroll;
}

video {
    width: 100%;
    height: auto;
    max-width: 100%;
    object-fit: contain;
}
</style>