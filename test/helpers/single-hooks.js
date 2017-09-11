const AVAHook = require("AVAHook");

class SingleHooks extends AVAHook {

  static get setup() {
    return {
      doOnSetup: "setup hook",
    };
  }

  static get cleanup() {
    return {
      doOnCleanup: "cleanup hook",
    };
  }

  doOnSetup(t) {
    this.setupCalled = true;
  }

  doOnCleanup(t) {
    this.cleanupCalled = true;
  }

}

module.exports = SingleHooks;
