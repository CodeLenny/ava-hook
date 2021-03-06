const ava = require("ava");
const merge = require("lodash.merge");

/**
 * Configuration for a single dependency.
 * @typedef {Object} DependencyOptions
 * @property {AVAHook} hook The hook to use for this dependency.  Required if creating a new hook.  Otherwise can be
 *   omitted if configuring an existing dependency.
 * @property {Object} [variables] Variable configuration to control the dependency.
*/

/**
 * Configuration options to control a {@link AVAHook} dependency from a parent {@link AVAHook}.
 * @typedef {Object<DependencyOptions>} DependencyList configuration for dependencies.
 *   Name each dependency with a custom string.  Map names to either {@link DependencyOptions} or `null` to disable
 *   the dependency.
 * @example <caption>Two Express servers as dependencies</caption>
 * const dependency = {
 *   core: {
 *     hook: AVAExpressServer,
 *     variables: {
 *       app: "core",
 *     },
 *   },
 *   secondary: {
 *     hook: AVAExpressServer,
 *     variables: {
 *       app: "backupApp",
 *     },
 *   },
 * };
*/

/**
 * Options to configure an instance of an {@link AVAHook}.
 * @typedef {Object} AVAHookOptions
 * @property {DependencyList} dependencies Configuration for dependencies.
 * @property {Object} [variables] Requested names for variables used in this hook.
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
   * Dependencies that should be run before this hook.
   * @return {DependencyList} the dependencies for this hook.
  */
  static get dependencies() {
    return {};
  }

  /**
   * The names of variables that will be used inside this hook, and exported when the hook is complete.
   * @return {String[]} the requested variable names.
  */
  static get variables() {
    return [];
  }

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
   * Register a global variable for use in {@link AVAHook} instances.  Provides an alternative name if the name is
   * already taken.
   * @param {String} varName the name of the variable to reserve.
   * @param {AVAHook} instance the instance of {@link AVAHook} (for debugging, etc.)
   * @param {String} [requested] an alternative name requested by the user.
   * @return {String} the final name of the variable that is reserved for this instance.
  */
  static registerVariable(varName, instance, requested) {
    let base = requested || varName;
    if(!this._reservedVariables[base]) {
      this._reservedVariables[base] = {
        reserved: true,
        varName,
        base,
        instances: [
          { instance, name: base },
        ],
      };
      return base;
    }
    let num = this._reservedVariables[base].instances.length + 1;
    while(this._reservedVariables[base + num]) { ++num; }
    const name = base + num;
    this._reservedVariables[name] = {
      reserved: true,
      varName,
      base,
      instances: [
        { instance, name },
      ],
    };
    this._reservedVariables[base].instances.push({ instance, name });
    return name;
  }

  /**
   * Create a new test helper that can later be connected to AVA.
   * @param {AVAHookOptions} opts options to configure this {@link AVAHook}.
  */
  constructor(opts) {
    this.opts = merge({}, {
      variables: {},
    }, opts);
  }

  /**
   * Register all stage hooks with AVA, and reserve variables.
  */
  register() {
    this.registerDependencies();
    this.reserveVariables();
    this.beforeEach();
    this.afterEach();
  }

  /**
   * Register all dependencies for this hook.
   * @todo Pass configuration to dependencies
   * @todo Test passing configuration
  */
  registerDependencies() {
    if(!this._dependencies) { this._dependencies = {}; }
    for(const dependencyName in this.constructor.dependencies) {
      if(this._dependencies[dependencyName]) { continue; }
      const Hook = this.constructor.dependencies[dependencyName];
      const dependency = new Hook();
      dependency.register();
      this._dependencies[dependencyName] = dependency;
    }
  }

  /**
   * Get a local dependency by name.
   * @param {String} name the name of the dependency
   * @return {AVAHook} the hook instance.
  */
  dependency(name) {
    return this._dependencies[name];
  }

  /**
   * Reserve all variables needed for this instance.  If variables are already claimed, alternatives will be found.
  */
  reserveVariables() {
    if(!this._variables) { this._variables = {}; }
    for(const varName of this.constructor.variables) {
      if(this._variables[varName]) { continue; }
      this._variables[varName] = this.constructor.registerVariable(varName, this, this.opts.variables[varName]);
    }
  }

  /**
   * Get the globally reserved name for a variable from the non-unique name used for this instnace.
   * @param {String} name the local name of the variable.
  */
  variable(name) {
    return this._variables[name];
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

AVAHook._reservedVariables = {};

module.exports = AVAHook;
