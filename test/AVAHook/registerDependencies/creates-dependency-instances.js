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

test.beforeEach("creates instance of 'DependentHook'", t => {
  t.context.hook = new DependentHook();
});

test.beforeEach("'registerDependencies'", t => {
  t.context.hook.registerDependencies();
});

test("populates '_dependencies'", t => {
  t.is(Object.keys(t.context.hook._dependencies).length, 1);
});

test("creates instance of 'BaseHook'", t => {
  t.true(t.context.hook._dependencies["base"] instanceof BaseHook);
});
