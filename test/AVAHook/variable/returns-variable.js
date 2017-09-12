const test = require("ava");
const AVAHook = require("AVAHook");
const VariableHooks = require("test/helpers/hook-with-variables");
const varName = VariableHooks.variables[0];
let hooks;

test.before("create 'VariableHooks' instance", () => {
  hooks = new VariableHooks();
});

test.before("reserve variables", () => {
  hooks.reserveVariables();
});

test("provides the name of variables", t => {
  t.is(hooks.variable(varName), varName);
});
