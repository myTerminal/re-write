# re-write

[![npm version](https://badge.fury.io/js/re-write.svg)](https://badge.fury.io/js/re-write)
[![npm downloads](https://img.shields.io/npm/dt/re-write.svg)](https://www.npmjs.com/package/re-write)  
[![Build Status](https://travis-ci.org/myTerminal/re-write.svg?branch=master)](https://travis-ci.org/myTerminal/re-write)
[![Code Climate](https://codeclimate.com/github/myTerminal/re-write.png)](https://codeclimate.com/github/myTerminal/re-write)
[![Coverage Status](https://img.shields.io/coveralls/myTerminal/re-write.svg)](https://coveralls.io/r/myTerminal/re-write?branch=master)  
[![Dependency Status](https://david-dm.org/myTerminal/re-write.svg)](https://david-dm.org/myTerminal/re-write)
[![devDependency Status](https://david-dm.org/myTerminal/re-write/dev-status.svg)](https://david-dm.org/myTerminal/re-write#info=devDependencies)
[![peer Dependency Status](https://david-dm.org/myTerminal/re-write/peer-status.svg)](https://david-dm.org/myTerminal/re-write#info=peerDependencies)  
[![License](https://img.shields.io/github/license/myTerminal/ample-alerts.svg)](https://opensource.org/licenses/MIT)  
[![NPM](https://nodei.co/npm/re-write.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/re-write/)

Rewrite files and directories into a single file and vice-versa

## What is it?

*re-write* is a command-line utility that can be used to 're-write' multiple files into a single file, optionally with password protection.

## Background

Back in late 2009, I wrote an encryption algorithm capable of obfuscating single files and I used it to transfer data without getting intercepted by intelligent security systems. The data belonged to me and I believed that I had a right to carry it across machines even to and from environments that did not allow me to do that. The utility was written in VB.Net.

In early 2010, I continued working on that utility to improve its efficiency and later I could enable it to work on files as well as directories.

're-write' is inspired by the old algorithm and is being now written in JavaScript. I started working on this command-line utility to share this secret weapon of mine with the open-source community.

## Installation

*re-write* is available on *Npm*. You can install it globally with a simple command.

    npm install -g re-write

## How to Use

're-write' is a command-line utility that has two basic commands and the inputs you provide and how they are interpreted depend upon the command you use.

### How to 're-write' Files

To 're-write' data into a single file, use the following command:

    re-write-do <source1> [source2] [source3] ... <target>
    
`source1`, `source2`, `source3`, etc. could be files or directories
`target` should be an output file or a directory where the 're-written' file will be placed

You can optionally use a password. Enter one when prompted for or just press `Enter` to skip encryption.

### How to un-'re-write' files

To 'un-re-write' data from a 're-written' file to the earlier form, use the following command:

    re-write-undo <source> <target>

`source` needs to be a file that was earlier created by 're-write'
`target` needs to be a directory in which the recovered data needs to be placed

If you used a password while 're-writing', you'll be asked for one before you can 'un-re-write'.
