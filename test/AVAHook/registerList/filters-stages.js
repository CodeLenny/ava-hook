const test = require("ava");
const sinon = require("sinon");
const proxyquire = require("proxyquire");
const mockAVA = require("test/helpers/mockAVA");

test.beforeEach("create stubs", t => {
  t.context.beforeEachStub = sinon.stub();
});

test.beforeEach("stub AVAHook", t => {
  t.context.AVAHook = proxyquire("AVAHook", {
    ava: mockAVA({
      beforeEach: t.context.beforeEachStub,
    }),
  });
});

test("registers existing stages", t => {
  class ExistingStages extends t.context.AVAHook {
    static get setup() {
      return {
        first: "first stage",
        second: "second stage",
      };
    }
    first() {}
    second() {}
  }

  let hook = new ExistingStages();
  hook.registerList(ExistingStages.setup, "beforeEach");
  t.is(t.context.beforeEachStub.callCount, 2);
});

test("ignores stages without methods", t => {
  class MissingStages extends t.context.AVAHook {
    static get setup() {
      return {
        firstMissing: "missing stage",
        actual: "actual stage",
        secondMissing: "second missing stage",
      };
    }
    actual() {}
  }

  let hook = new MissingStages();
  hook.registerList(MissingStages.setup, "beforeEach");
  t.is(t.context.beforeEachStub.callCount, 1);
});
