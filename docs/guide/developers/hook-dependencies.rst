=======================
Using Hook Dependencies
=======================

We :doc:`previously covered </guide/developers/first-hook>` setting up a basic AVA hook,
where we created a hook that constructed a bare Express server.

If we wanted to create a more complex hook, such as constructing a GraphQL API inside an Express server,
it would be nice to re-use the Express hook instead of doing all that work again.

AVA Hook has a basic syntax for adding dependencies for new AVA Hooks.

Environment
===========

This guide will assume that you already have the AVA Hook that creates an Express server.

We'll create a second NPM package for this GraphQL API layer.

.. code-block:: sh
  :caption: NPM Setup
  
  mkdir ava-express-graphql
  cd ava-express-graphql
  npm init

Installation
============

We'll be using `ava-hook`, the `ava-express-server` we created before, and the `express-graphql` package.

.. code-block:: sh
  :caption: Package Installation
  
  npm install --save ava-hook ava-express-server express-graphql

Hook Interface
==============

.. code-block:: js
  :caption: ExpressGraphQLHook.js
  :linenos:
  
  const AVAHook = require("ava-hook");
  const AVAExpressServer = require("ava-express-server");
  const graphql = require("express-graphql");
  
  class ExpressGraphQLHook extends AVAHook {
    
    static get dependencies() {
      
    }
    
    static get setup() {
      return {
        addMiddleware: "add GraphQL middleware",
      };
    }
    
    addMiddleware(t) {
      
    }
    
    addGet(t) {
      
    }
    
  }

Declare Dependencies
====================

To use the Express hook that we already created, we need to mark it as a dependency.

.. code-block:: js
  :linenos:
  :emphasize-lines: 6-8
  
  const AVAExpressServer = require("ava-express-server");
  
  class ExpressGraphQLHook extends AVAHook {
    
    static get dependencies() {
      return {
        app: AVAExpressServer,
      };
    }
    
  }

`dependencies` takes the list of AVA hooks, indexed by a custom name.
By using unique custom names, we can use the same hook as a dependency twice.
This could be useful if we wanted two different temporary files.

Now that the dependency has been declared, the dependent's setup/cleanup hooks will be registered before our own hooks
stages.

Use Dependencies
================

Now that the Express setup/cleanup hooks have been registered, we can use the server in our own hooks.

.. code-block:: js
  :linenos:
  :emphasize-lines: 6-10
  
  const graphql = require("express-graphql");
  
  class ExpressGraphQLHook extends AVAHook {
    
    addMiddleware(t) {
      const app = t.context[this.dependency("app").variable("app")];
      app.use("/graphql", graphql({
        schema: {},
        graphiql: true,
      }));
    }
    
  }

.. note:: Simplifed Example
  This is a basic example of hook dependencies, and the `graphql` configuration has been simplifed.
  
  You should probably use a variable for the Express URL, GraphQL schema, and the other variables.

We can use `this.dependency` to get the AVAHook instance for the Express hook.
This ensures that we use the correct variable name for the Express server,
even if the variable name was changed to avoid a conflict.
