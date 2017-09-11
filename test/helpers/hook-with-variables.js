const AVAHook = require("AVAHook");

class VariableHooks extends AVAHook {

  static get variables() {
    return [
      "id",
      "name",
    ];
  }

}

module.exports = VariableHooks;
