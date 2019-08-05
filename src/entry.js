#!/usr/bin/env node

/* global require */

const helper = require('./helper');
const reWrite = require('./re-write');

const args = Array.from(process.argv); // Arguments as an array
const operation = args[1]; // Operation argument
const parameters = args.slice(2); // Operation parameters

const action = operation.indexOf('undo') > -1 ? reWrite.undoIt : reWrite.doIt; // Action to be performed
const [input, output] = helper.getInputAndOutputItems(action, parameters); // Input and output for the action

action(input, output); // Perform the action on input and output
