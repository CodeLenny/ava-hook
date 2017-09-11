const test = require("ava");
const AVAHook = require("AVAHook");

test("adds entry in '_reservedVariables'", t => {
  let varName = AVAHook.registerVariable("addsEntry", {});
  t.is(typeof AVAHook._reservedVariables[varName], "object");
});

test("flags 'reserved'", t => {
  let varName = AVAHook.registerVariable("reservedFlag", {});
  t.is(AVAHook._reservedVariables[varName].reserved, true);
});
