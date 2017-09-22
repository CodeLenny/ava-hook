const test = require("ava");
const DependentHook = require("test/helpers/dependencies/DependentHook");

let hook = new DependentHook();
hook.register();

test("has 'baseVariable'", t => {
  t.is(t.context.baseVariable, true);
});

test("has 'dependentVariable'", t => {
  t.is(t.context[hook.variable("dependentVariable")], true);
});

test("has 'mergedVariable'", t => {
  t.deepEqual(t.context[hook.variable("mergedVariable")], {
    base: true,
    dependent: true,
  });
});
