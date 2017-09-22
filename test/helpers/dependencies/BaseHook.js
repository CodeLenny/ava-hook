const AVAHook = require("AVAHook");

class BaseHook extends AVAHook {

  static get variables() {
    return [
      "baseVariable",
    ];
  }

  static get setup() {
    return {
      startup: "Base Setup",
    };
  }

  startup(t) {
    t.context[this.variable("baseVariable")] = true;
  }

}

module.exports = BaseHook;
