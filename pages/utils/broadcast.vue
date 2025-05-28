<template>
    <div class="text-white fixed bg-black text-30px">
        <h1>Broadcast</h1>
        <div>{{ channel }}</div>
        <div>{{ isSupported }}</div>
        <div>{{ isClosed }}</div>
        <div>{{ error }}</div>
        <div>{{ message }}</div>
        <button @click="post(message.value)">Post</button>
        <button @click="close()">Close</button>
        <input type="text" v-model="message" />
    </div>
</template>

<script setup>
const {
    isSupported,
    channel,
    post,
    close,
    error,
    isClosed,
    data,
} = useBroadcastChannel({ name: 'vueuse-demo-channel' })

const message = shallowRef('')

message.value = 'Hello, VueUse World!'

// Post the message to the broadcast channel:
post(message.value)

watch(data, (newData) => {
    console.log(newData)
})

// Option to close the channel if you wish:
close()
</script>