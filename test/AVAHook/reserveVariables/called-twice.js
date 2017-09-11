const test = require("ava");
const AVAHook = require("AVAHook");
const VariableHooks = require("test/helpers/hook-with-variables");
const varName = VariableHooks.variables[0];
let hooks;

test.before("create 'VariableHooks' instance", () => {
  hooks = new VariableHooks();
});

test("doesn't re-register variables", t => {
  hooks.reserveVariables();
  const reservedVariables = Object.assign({}, AVAHook._reservedVariables);
  hooks.reserveVariables();
  t.deepEqual(AVAHook._reservedVariables, reservedVariables);
});
