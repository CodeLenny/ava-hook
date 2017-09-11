const test = require("ava");
const sinon = require("sinon");
const AVAHook = require("AVAHook");

test.beforeEach("create 'AVAHook' instance", t => {
  t.context.hook = new AVAHook();
});

test.beforeEach("add spies", t => {
  sinon.stub(t.context.hook, "beforeEach");
  sinon.stub(t.context.hook, "afterEach");
});

function startsUncalled(t, method) {
  t.not(t.context.hook[method].called, true);
}

startsUncalled.title = (name, method) => name || `'${method}' starts un-called`;

test(startsUncalled, "beforeEach");
test(startsUncalled, "afterEach");

function calledByRegister(t, method) {
  t.context.hook.register();
  t.true(t.context.hook[method].calledOnce);
}

calledByRegister.title = (name, method) => name || `'${method}' is called by 'register'`;

test(calledByRegister, "beforeEach");
test(calledByRegister, "afterEach");
