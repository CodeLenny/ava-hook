const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const mockAVA = require("test/helpers/mockAVA");

const beforeEachStub = sinon.stub();
let hooks;

const SingleHooks = proxyquire("test/helpers/single-hooks.js", {
  ava: mockAVA({
    beforeEach: beforeEachStub,
  }, true),
});

test.before("create 'SingleHooks' instance", t => {
  hooks = new SingleHooks();
});

test.before("stub 'registerList'", t => {
  sinon.stub(hooks, "registerList");
});

test("passes 'setup' object to 'registerList'", t => {
  hooks.afterEach();
  t.true(hooks.registerList.calledWith(SingleHooks.cleanup, "afterEach"));
});
