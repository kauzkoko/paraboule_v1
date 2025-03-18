const OSC = require("osc-js");

const osc = new OSC({ plugin: new OSC.BridgePlugin() });
osc.open();

osc.on("open", () => {
  console.log("osc server open");
  osc.on("*", ({ address, args }) => {
    console.log("address", address, "args", args);
  });
});
