# AVA Hook

A formal interface for test helpers that mock and cleanup variables in `test.beforeEach` and `test.afterEach` sections.

This is an unofficial format for the [AVA][] library, and has no connection with the [AVA][] project.

## Features

For developers writing AVA hooks, `ava-hook` provides a well-featured and tested container to add your setup and cleanup
code to.
Instead of re-inventing the wheel in every library, `ava-hook` provides a user-focused interface, generic documentation
for using the hook, and extra configuration to control the functionality of the hook.

- Simple syntax for defining the stages of your hook (both for setup and for cleanup)
- Variable registration system to ensure that variables in `t.context` are free from conflict
- *(soon)* User-visible configuration variables
- Dependency system to use other `ava-hook` modules for setup

`ava-hook` is also focused on being flexible both for the hook developer as well as the end user.
Most of the features above are customizable, based on options provided.
Additionally, most parts of `ava-hook` are over-ridable, both by the hook developer and the end user.

## Overview

AVA hooks have three core sections:

- **Dependencies** allow hooks to create instances of other hooks.  For instance, a file-system based database may need
  a temporary directory to be created.
- **Config** variables allow basic properties to be tweaked.  For instance, the database may have an "in-memory" option.
- **Variables** define the sections that will be added to `t.context` in the AVA test instance.
  AVA hooks will make sure that variables don't conflict, and can either throw errors or rename variables when conflicts
  occur.

AVA hooks are designed so the hook developer provides the basic sections that they intend to run.
The end-user can override any dependencies defined (or provide different configuration to them), configure the variables
that will be added to `t.context`, and also configure how the hook is implemented:

- Each stage of the hook (creating a database instance, loading temporary data, etc.) can be given their own hidden
  `beforeEach()`, to provide easy debugging if the library breaks.
  *(default)*
- All stages of the hook can be grouped together into a single `beforeEach()` hook.
- The user can create reach inside the AVA hook and create a `beforeEach()` hook for each stage in the AVA hook.

## Example Hook

### TingoDB Database Hook

#### End-User

Let's draft a test that needs to use two different databases.
We'll be using a (fake) `ava-tingo-db` library, which will setup two mock databases for us.

We'll start with requiring `ava`:

```js
const test = require("ava");
```

Now we can grab the `ava-tingo-db` library, and create two database instances.

```js
const AVATingoDB = require("ava-tingo-db");

let db1 = new AVATingoDB({
  variables: {
    db: "db1",
  },
});

let db2 = new AVATingoDB({
  variables: {
    db: "db2"
  },
});
```

To reduce side-effects, the constructor doesn't make any changes to AVA.
Intead, the `register()` method will create `beforeEach()` statements that will setup both databases.

```js
db1.register();
db2.register();
```

Now we can use both databases in a test:

```js
test("can create data", t => {
  const first = t.context.db1;
  const second = t.context.db2;
  // ...
});
```

#### `ava-tingo-db` Module

Definition of the module:

```js
// Import the AVAHook class
const AVAHook = require("ava-hook");

// Import any dependencies
const AVATmpDir = require("ava-tmp-dir");

class AVATingoDB extends AVAHook {
  
  // Map instances of dependencies
  static get dependencies() {
    return {
      storage: AVATmpDir, // We'll get a temporary directory to use for storing our TingoDB data
      // Dependencies can be repeated with different keys - e.g. you might need two different storage directories.
    };
  }
  
  // Define the different variables that this plugin will export into `t.context`
  static get variables() {
    return [
      "db",
    ];
  }
  
  // List the different `t.beforeEach()` calls that you want to make, and provide the method that should be called.
  static get stages() {
    return {
      createDB: "create database",
    },
  }
  
  // Define the stages of your module.
  createDB(t) {
    const dir = t.context[this.dependency("storage").variable("dir")];
    t.context[this.variable("db")] = new TingoDB(dir);
  }
  
}
```

[AVA]: https://github.com/avajs/ava
