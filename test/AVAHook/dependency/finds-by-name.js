const test = require("ava");
const AVAHook = require("AVAHook");

test.beforeEach("create 'AVAHook'", t => {
  t.context.hook = new AVAHook();
});

test.beforeEach("create '_dependencies'", t => {
  t.context.hook._dependencies = {
    foo: "bar",
  };
});

test("returns entries from '_dependencies'", t => {
  t.is(t.context.hook.dependency("foo"), "bar");
});
