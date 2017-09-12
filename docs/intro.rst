============
Introduction
============

A formal interface for test helpers that mock and cleanup variables in `test.beforeEach` and `test.afterEach` sections.

This is an unofficial format for the AVA library, and has no connection with the AVA project.

Features
========

For developers writing AVA hooks, `ava-hook` provides a well-featured and tested container to add your setup and cleanup
code to.
Instead of re-inventing the wheel in every library, `ava-hook` provides a user-focused interface, generic documentation
for using the hook, and extra configuration to control the functionality of the hook.

* Simple syntax for defining the stages of your hook (both for setup and for cleanup)
* Variable registration system to ensure that variables in `t.context` are free from conflict
* *(soon)* User-visible configuration variables
* *(soon)* Dependency system to use other `ava-hook` modules for setup

`ava-hook` is also focused on being flexible both for the hook developer as well as the end user.
Most of the features above are customizable, based on options provided.
Additionally, most parts of `ava-hook` are overridable, both by the hook developer and the end user.

Next
====

Want to learn more conceptually?  Start with the :doc:`/overview`.

Ready to start using `ava-hook` in your own projects?  Read the :doc:`/guide/developers`.

Are you trying to use an AVA hook module that is using `ava-hook`?  Check out the :doc:`/guide/users`.

See the :doc:`/api` reference for other technical details.
