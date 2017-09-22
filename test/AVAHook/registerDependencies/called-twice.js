const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const mockAVA = require("test/helpers/mockAVA");

const beforeEachStub = sinon.stub();

const BaseHook = proxyquire("test/helpers/dependencies/BaseHook", {
  ava: mockAVA({
    beforeEach: beforeEachStub,
  }, true),
});

const DependentHook = proxyquire("test/helpers/dependencies/DependentHook", {
  "./BaseHook": BaseHook,
  ava: mockAVA({
    beforeEach: beforeEachStub,
  }, true),
});

let hooks;

test.before("create 'DependentHook' instance", () => {
  hooks = new DependentHook();
});

test("doesn't re-register dependencies", t => {
  hooks.registerDependencies();
  const instances = Object.assign({}, hooks._dependencies);
  hooks.registerDependencies();
  t.deepEqual(hooks._dependencies, instances);
});
