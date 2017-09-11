const ava = require("ava");

/**
 * Options to configure an instance of an {@link AVAHook}.
 * @typedef {Object} AVAHookOptions
*/

/**
 * A list of stages for a {@link AVAHook}.  Stages are provided as `{ <method name>: <description> }`.
 * `<method name>` is the name of a method inside the {@link AVAHook} to run during the stage.
 * @typedef {Object} StageList
*/

/**
 * Abstract interface for test helpers.
 * @abstract
*/
class AVAHook {

  /**
   * The list of stages to setup, with the description to provide `t.beforeEach()`.
   * @return {StageList} the list of stages for this test helper that should be run in `beforeEach()`.
  */
  static get setup() {
    return {};
  }

  /**
   * The list of stages to cleanup, with the description to provide `t.afterEach()`.
   * @return {StageList} the list of stages for this test helper that should be run in `afterEach()`.
  */
  static get cleanup() {
    return {};
  }

  /**
   * Create a new test helper that can later be connected to AVA.
   * @param {AVAHookOptions} opts options to configure this {@link AVAHook}.
  */
  constructor(opts) {
  }

  /**
   * Register all stage hooks with AVA.
  */
  register() {
    this.beforeEach();
    this.afterEach();
  }

  /**
   * Register each stage hook with AVA from the given list.
   * @param {StageList} list the stages to register
   * @param {String} type the AVA hook to register stages with.
  */
  registerList(list, type) {
    for(const stage in list) {
      if(typeof this[stage] !== "function") { continue; }
      const name = list[stage];
      ava[type](name, t => this[stage](t));
    }
  }

  /**
   * Register each `beforeEach()` stage with AVA.
  */
  beforeEach() {
    return this.registerList(this.constructor.setup, "beforeEach");
  }

  /**
   * Register each `afterEach()` stage with AVA.
  */
  afterEach() {
    return this.registerList(this.constructor.cleanup, "afterEach");
  }

}

module.exports = AVAHook;
