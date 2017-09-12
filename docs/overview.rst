========
Overview
========

AVA hooks have three core sections:

* **Dependencies** allow hooks to create instances of other hooks.  For instance, a file-system based database may need
  a temporary directory to be created.
* **Config** variables allow basic properties to be tweaked.  For instance, the database may have an "in-memory" option.
* **Variables** define the sections that will be added to `t.context` in the AVA test instance.
  AVA hooks will make sure that variables don't conflict, and can either throw errors or rename variables when conflicts
  occur.

AVA hooks are designed so the hook developer provides the basic sections that they intend to run.
The end-user can override any dependencies defined (or provide different configuration to them), configure the variables
that will be added to `t.context`, and also configure how the hook is implemented:

* Each stage of the hook (creating a database instance, loading temporary data, etc.) can be given their own hidden
  `beforeEach()`, to provide easy debugging if the library breaks.
  *(default)*
* All stages of the hook can be grouped together into a single `beforeEach()` hook.
* The user can create reach inside the AVA hook and create a `beforeEach()` hook for each stage in the AVA hook.
