/**
 * Options to configure an instance of an {@link AVAHook}.
 * @typedef {Object} AVAHookOptions
*/

/**
 * Abstract interface for test helpers.
 * @abstract
*/
class AVAHook {

  /**
   * Create a new test helper that can later be connected to AVA.
   * @param {AVAHookOptions} opts options to configure this {@link AVAHook}.
  */
  constructor(opts) {
  }

}

module.exports = AVAHook;
