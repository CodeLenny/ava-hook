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

test("variables are added to 'AVAHook._reservedVariables'", t => {
  t.is(typeof AVAHook._reservedVariables[varName], "object");
});

test("variable names are added to 'AVAHook#_variables'", t => {
  t.is(hooks._variables[varName], varName);
});
