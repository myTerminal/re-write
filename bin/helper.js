"use strict";var fs=require("fs"),path=require("path"),_require=require("./interface"),showError=_require.showError,errors=_require.errors,reWrite=require("./re-write"),defaultOutputFileName="output-file.txt",defaultOutputDirectory="./",getFilesInDirectory=function t(e,r){var n=1<arguments.length&&void 0!==r?r:[];return fs.readdirSync(e).forEach(function(r){fs.statSync(path.join(e,r)).isDirectory()?n=t(path.join(e,r),n):n.push(path.join(e,r))}),n},inflateInput=function(r){return r.map(function(r){return fs.lstatSync(r).isDirectory()?getFilesInDirectory(r):[r]}).reduce(function(r,t){return r.concat(t)},[])},isDirectory=function(r){return fs.existsSync(r)&&fs.statSync(r).isDirectory()},isFile=function(r){return fs.existsSync(r)&&fs.statSync(r).isFile()},getInputAndOutputForTransform=function(r){r.length<2&&showError(errors.ARG_COUNT_LESS);var t=r.slice(0).pop();return isFile(t)&&showError(errors.TARGET_FILE_EXISTS),[inflateInput(r.slice(0,r.length-1)),isDirectory(t)?path.join(t,defaultOutputFileName):t]},getInputAndOutputForRecover=function(r){return 2<r.length&&showError(errors.ARG_COUNT_MORE),r.length<1&&showError(errors.ARG_COUNT_LESS),(!isFile(r[0])||1<r.length&&!isDirectory(r[1]))&&showError(errors.UNDO_ARGS_INVALID),2===r.length?r:r.concat([defaultOutputDirectory])};module.exports.getInputAndOutputItems=function(r,t){return r===reWrite.doIt?getInputAndOutputForTransform(t):getInputAndOutputForRecover(t)};