const test = require("ava");
const AVAHook = require("AVAHook");

test("uses requested instead of supplied variable name", t => {
  t.is(
    AVAHook.registerVariable("actualName", {}, "otherName"),
    "otherName"
  );
});
