#!/usr/bin/env node
"use strict";var helper=require("./helper"),reWrite=require("./re-write");module.exports=function(e){var r=-1<e[1].indexOf("undo")?reWrite.undoIt:reWrite.doIt,t=helper.getInputAndOutputItems(r,e);r(t[0],t[1])};