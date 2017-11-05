#!/usr/bin/env node

/* global require module */

var helper = require('./helper'),
    reWrite = require('./re-write');

module.exports = function (args) {
    var action = args[1].indexOf('undo') > -1 ? reWrite.undoIt : reWrite.doIt,
        items = helper.getInputAndOutputItems(action, args),
        input = items[0],
        output = items[1];

    action(input, output);
};
