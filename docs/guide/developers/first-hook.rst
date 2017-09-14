==============
Writing a Hook
==============

This is intended to be a quick-start guide to get you writing an AVA hook using the `ava-hook` library.

For a more in-depth overview, please see the :doc:`/overview`.

Overview
========

This guide will be creating an AVA hook that will create a simple Express server.

Environment
===========

This guide assumes that you are writing a Node.js module that is only focused on exporting this single AVA hook.
These instructions would need to be adapted for use inside a larger program.

.. code-block:: sh
  :caption: Sample Module Setup
  
  mkdir ava-express-server
  cd ava-express-server
  npm init

Installation
============

Install `ava-hook` via NPM:

.. code-block:: sh
  
  npm install --save ava-hook

Extend `ava-hook`
=================

Start by inheriting the basic methods from `AVAHook`.
.. TODO: link to API

.. code-block:: js
  :caption: AVAExpressServer.js

  const AVAHook = require("ava-hook");
  
  class AVAExpressServer extends AVAHook {
    
  }
  
  module.exports = AVAExpressServer;

Declare Variables
=================

We'll want to add the Express server (returned from `express()`) to the test context (`t.context`).

By declaring the variable through `ava-hook`,
the library will ensure that no other hooks are already using our variable.

When variable conflicts are detected, `ava-hook` will automatically assign us an unused variable.

.. code-block:: js
  :linenos:
  :emphasize-lines: 3-7

  class AVAExpressServer extends AVAHook {
    
    static get variables() {
      return [
        "app",
      ];
    }
    
  }

Define Hooks
============

Next we'll add methods to the class for each setup or cleanup hook we want.

When interacting with `t.context`, we'll use `this.variable()`, which may provide a slightly-modified variable to avoid
conflicts.

.. code-block:: js
  :linenos:
  :emphasize-lines: 1,5-11
  
  const express = require("express");
  
  class AVAExpressServer extends AVAHook {
    
    createServer(t) {
      t.context[this.variable("app")] = express();
    }
    
    cleanupServer(t) {
      delete t.context[this.variable("app")];
    }
    
  }

We don't really need the `cleanupServer` stage (as garbage collection should take care of it), but we'll use it for this
guide.

Register Hooks
==============

Now that we've got the methods written, we can register them with `AVAHook` so `test.beforeEach()` hooks will be
automatically created.

.. code-block:: js
  :linenos:
  :emphasize-lines: 3-13
  
  class AVAExpressServer extends AVAHook {
    
    static get setup() {
      return {
        createServer: "create Express server",
      };
    }
    
    static get cleanup() {
      return {
        cleanupServer: "teardown Express server",
      };
    }
    
  }

`setup()` and `cleanup()` take a list of the methods to call in `beforeEach()` and `afterEach()` (respectively),
and also include the title to provide for each stage.

Conclusion
==========

Entire File
-----------

First, here's the entire file:

.. code-block:: js
  :caption: AVAExpressServer.js
  :linenos:
  
  const AVAHook = require("ava-hook");
  const express = require("express");
  
  class AVAExpressServer extends AVAHook {
    
    static get variables() {
      return [
        "app",
      ];
    }
    
    static get setup() {
      return {
        createServer: "create Express server",
      };
    }
    
    static get cleanup() {
      return {
        cleanupServer: "teardown Express server",
      };
    }
    
    createServer(t) {
      t.context[this.variable("app")] = express();
    }
    
    cleanupServer(t) {
      delete t.context[this.variable("app")];
    }
    
  }
  
  module.exports = AVAExpressServer;

Example Usage
-------------

.. code-block:: js
  :linenos:
  
  const test = require("ava");
  const AVAExpressServer = require("ava-express-server");
  const request = require("supertest");
  
  let server = new AVAExpressServer();
  server.register();
  
  test("default Express routing", t => {
    return request(t.context.app)
      .get("/undefined-path/")
      .expect(404);
  });

Summary
-------

We've integrated several different features of `ava-hook` in the above example.  We'll briefly break them down.

.. TODO: Link to method definitions, etc.

Variables
^^^^^^^^^

We're using "Hook Variables" twice in this example.

First, we override `AVAHook.variables` to define the custom variables that we want to set.

Then in our "Hook Stages", we use `this.variable()` to retrieve the context variable name.
Normally this will be the same as the requested variable name
(e.g. `this.variable("app")` will normally return `"app"`),
but the variable name may be altered to avoid a collision in the context variables.

Hook Stages
^^^^^^^^^^^

We defined instance methods that contain the body of our setup and cleanup hooks.  In our example, we registered these
stages with `AVAHook` so that the user can call `AVAExpressServer#register`, but the user could also pluck individual
stages in custom `test.beforeEach` statements:

.. code-block:: js
  :linenos:
  
  const test = require("ava");
  const AVAExpressServer = require("ava-express-server");
  
  const server = new AVAExpressServer();
  
  test.beforeEach("create server", server.createServer);
  
  // ...

Most users will likely use `#register` to setup all hooks at once instead of dealing with each individual hook, but
having the ability to access each hook individually enables better debugging or customization.

Stage Registration
^^^^^^^^^^^^^^^^^^

Finally, we overrode `AVAHook.setup` and `AVAHook.cleanup` to register each stage with the hook, and provided names for
each step.
