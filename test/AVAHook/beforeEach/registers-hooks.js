const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const beforeEachStub = sinon.stub();
const mockAVA = require("test/helpers/mockAVA");

const SingleHooks = proxyquire("test/helpers/single-hooks.js", {
  ava: mockAVA({
    beforeEach: beforeEachStub,
  }, true),
});

let hooks;

test.before("creates 'SingleHooks' instance", t => {
  hooks = new SingleHooks();
});

test.before("setup mocks", t => {
  sinon.stub(hooks, "doOnSetup");
});

test.before("calls 'beforeEach'", t => {
  hooks.beforeEach();
});

test("calls 'beforeEach' once", t => {
  t.true(beforeEachStub.calledOnce);
});

test("uses the provided name", t => {
  t.true(beforeEachStub.args[0][0] === "setup hook");
});

test("registers the 'doOnSetup' method", t => {
  t.plan(2);
  t.false(hooks.doOnSetup.called);
  beforeEachStub.args[0][1]();
  t.true(hooks.doOnSetup.called);
});
