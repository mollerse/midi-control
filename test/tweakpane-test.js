import midiControl from "../index.js";

let controls = midiControl("tweakpane", ["Testing Tweakpane"]);

await controls.init("Launch Control MIDI 1");

function logSomething() {
  console.log("something");
}

controls.createBinding("Test");
controls
  .enableDebug()
  .addColorValue("testcolor", ["#ff00ffff"])
  .addNumberValue("testnumber", [0, -100, 100, 1], {
    triggerId: 21,
  })
  .addBooleanValue("testbool", [true], {
    triggerId: 9,
    eventId: 128,
    onChange: function ({ value }) {
      controls.send(144, 9, value ? 60 : 15);
    },
  })
  .addNumberValue("testscale", [0, -2, 2, 1], {
    triggerId: [116, 117],
    eventId: 176,
    onChange: function ({ value }) {
      controls.send(176, 117, [15, 13, 0, 0, 0][2 - value]);
      controls.send(176, 116, [0, 0, 0, 13, 15][2 - value]);
    },
  })
  .addBooleanValue("testonoff", [true], {
    triggerId: [114, 115],
    eventId: 176,
    onChange: function ({ value }) {
      controls.send(176, 114, value ? 15 : 0);
      controls.send(176, 115, value ? 0 : 15);
    },
  })
  .addEffect("Do something", [logSomething], { triggerId: 9 });
