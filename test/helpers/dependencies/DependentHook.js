const AVAHook = require("AVAHook");
const BaseHook = require("./BaseHook");

class DependentHook extends AVAHook {

  static get dependencies() {
    return {
      base: BaseHook,
    };
  }

  static get variables() {
    return [
      "dependentVariable",
      "mergedVariable",
    ];
  }

  static get setup() {
    return {
      startup: "Dependent Setup",
      merge: "Merge Variables",
    };
  }

  startup(t) {
    t.context[this.variable("dependentVariable")] = true;
  }

  merge(t) {
    t.context[this.variable("mergedVariable")] = {
      base: t.context[this.dependency("base").variable("baseVariable")],
      dependent: t.context[this.variable("dependentVariable")],
    };
  }

}

module.exports = DependentHook;
