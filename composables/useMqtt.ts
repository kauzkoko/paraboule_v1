import mqtt from "mqtt";

export function useMqtt() {  
  // const client = mqtt.connect("wss://protoboules.cloud.shiftr.io", {
  //   username: "protoboules",
  //   password: "kXplRQY5kAhKpP6P",
  //   clientId: "protoboules-" + Math.random().toString(16).substring(2, 8),
  //   port: 443
  // });

  // client.on("connect", () => {
  //   console.log("Connected to MQTT Broker");
  // });

  const end = () => {
    // client.end();
  };

  const sendCochonnetMqtt = (message: string) => {
    const topic = "cochonnet";
    // client.publish(topic, message, {}, (err) => {
    //   if (err) {
    //     console.error("Publish error:", err);
    //   }
    // });
  };

  const sendHoolaMqtt = (message: string) => {
    const topic = "hoola";
    // client.publish(topic, message, {}, (err) => {
    //   if (err) {
    //     console.error("Publish error:", err);
    //   }
    // });
  };

  return { sendCochonnetMqtt, sendHoolaMqtt };
}
