const test = require("ava");
const AVAHook = require("AVAHook");

test("is empty", t => {
  t.deepEqual(AVAHook.cleanup, {});
});
