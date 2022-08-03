# re-write

[![npm version](https://badge.fury.io/js/re-write.svg)](https://badge.fury.io/js/re-write)
[![npm downloads](https://img.shields.io/npm/dt/re-write.svg)](https://www.npmjs.com/package/re-write)
[![License](https://img.shields.io/github/license/myTerminal/ample-alerts.svg)](https://opensource.org/licenses/MIT)  
[![Build Status](https://travis-ci.org/myTerminal/re-write.svg?branch=master)](https://travis-ci.org/myTerminal/re-write)
[![Code Climate](https://codeclimate.com/github/myTerminal/re-write.png)](https://codeclimate.com/github/myTerminal/re-write)
[![js-myterminal-style](https://img.shields.io/badge/code%20style-myterminal-blue.svg)](https://www.npmjs.com/package/eslint-config/myterminal)
[![Coverage Status](https://img.shields.io/coveralls/myTerminal/re-write.svg)](https://coveralls.io/r/myTerminal/re-write?branch=master)  
[![NPM](https://nodei.co/npm/re-write.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/re-write/)

Rewrite files and directories into a single file and vice-versa

> **Note:** Breaking changes in version 1

## What is it?

*re-write* is a command-line utility that can be used to 're-write' multiple files (and/or directories) into a single file, optionally with password protection.

## Background

Back in late 2009, I wrote an encryption algorithm capable of obfuscating a single file and I used it to transfer data past an intelligent security system designed specifically to intercept the transfer of computer code. The data belonged to me and I believed that I shouldn't be stopped from carrying it with me. The utility was written in VB.Net as a class library and was a small dependency of a far larger windows application.

In early 2010, I continued working on it to improve its efficiency and later I could enable it to work on multiple inputs, which could even be a combination of files and directories.

're-write' is inspired by that old algorithm and has been re-written in JavaScript, which almost forms the reason for its name. The purpose of this 're-write' is to make sure that the old code doesn't die and also that I could share it with the open-source community.

## Installation

*re-write* is available on *Npm*. You can install it globally with a simple command.

    npm install -g re-write

## How to Use

're-write' just has two commands. The inputs you provide and how they are interpreted depend upon the command you use.

### How to 're-write' Files

To 're-write' data into a single file, use the following command:

    re-write-do <source1> [source2] [source3] ... <target>
    
- `source1`, `source2`, `source3`, etc. could be one or more files or directories. At least one is required.
- `target` should be an output file or a directory where the 're-written' file should be placed.

You can optionally use a password when asked for. When not provided, encryption is skipped entirely.

### How to un-'re-write' files

To un-'re-write' data from a 're-written' file to the earlier form, use the following command:

    re-write-undo <source> [target]

- `source` needs to be a file that was earlier created by 're-write'.
- `target` can to be a directory in which the recovered data needs to be extracted. When not supplied, it defaults to the current directory.

If you used a password while 're-writing', you'll be asked for one before you can un-'re-write'.
