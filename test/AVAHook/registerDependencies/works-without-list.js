const test = require("ava");
const AVAHook = require("AVAHook");

test.beforeEach("creates 'AVAHook' instance", t => {
  t.context.hook = new AVAHook();
});

test("starts without '_dependencies' object", t => {
  t.is(typeof t.context.hook._dependencies, "undefined");
});

test("creates '_dependencies' object", t => {
  t.context.hook.registerDependencies();
  t.deepEqual(t.context.hook._dependencies, {});
});
