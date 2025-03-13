import mqtt from "mqtt";

export function useMqtt() {
  const runtimeConfig = useRuntimeConfig();

  const username = runtimeConfig.public.ADAFRUIT_AIO_USERNAME;
  const password = runtimeConfig.public.ADAFRUIT_AIO_KEY;
  const topic = `${username}/feeds/cochonet`;

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
    });
  });

  const end = () => {
    client.end();
  };

  const sendCochonet = (message: string) => {
    const topic = `${username}/feeds/cochonet`;
    client.publish(topic, message, {}, (err) => {
      if (err) {
        console.error("Publish error:", err);
      }
    });
  };

  const sendHoola = (message: string) => {
    const topic = `${username}/feeds/hoola`;
    client.publish(topic, message, {}, (err) => {
      if (err) {
        console.error("Publish error:", err);
      }
    });
  };

  return { sendCochonet, sendHoola, end };
}
