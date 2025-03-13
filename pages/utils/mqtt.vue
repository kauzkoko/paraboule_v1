<template>
  <div>
	<div>MQTT</div>
<button @click="send">send</button>
  </div>
</template>

<script setup>
import mqtt from "mqtt";

const runtimeConfig = useRuntimeConfig();

const username = runtimeConfig.public.ADAFRUIT_AIO_USERNAME;
const password = runtimeConfig.public.ADAFRUIT_AIO_KEY;
const topic = `${username}/feeds/temperature`;

const broker = "wss://io.adafruit.com:443";
const client = mqtt.connect(broker, {
  username,
  password,
});

client.on("connect", () => {
  console.log("Connected to MQTT Broker");

  // Publish a message
  client.publish(topic, "kacker!", {}, (err) => {
    if (err) {
      console.error("Publish error:", err);
    } else {
      console.log(`Message sent to ${topic}`);
    }

    // Close the connection
    // client.end();
  });
});

const send = () => {
  client.publish(topic, "kacker from send!", {}, (err) => {
	if (err) {
	  console.error("Publish error:", err);
	} else {
	  console.log(`Message sent to ${topic}`);
	}
  });
};

client.on("error", (err) => {
  console.error("MQTT Error:", err);
});
</script>
