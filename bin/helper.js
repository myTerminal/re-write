"use strict";var fs=require("fs"),path=require("path"),errors=require("./errors"),reWrite=require("./re-write");module.exports=function(){var r=function r(t,e){var n=fs.readdirSync(t);return e=e||[],n.forEach(function(n){fs.statSync(path.join(t,n)).isDirectory()?e=r(path.join(t,n),e):e.push(path.join(t,n))}),e},t=function(t){return t.map(function(t){return fs.lstatSync(t).isDirectory()?r(t):[t]}).reduce(function(r,t){return r.concat(t)},[])};return{getInputAndOutputItems:function(r,e){var n,s,i=e.slice(0).pop(),o=fs.existsSync(i)&&fs.statSync(i).isDirectory();return e.length<4&&errors.showError("ARG_COUNT_LESS"),r===reWrite.doIt?(n=t(e.slice(2,e.length-1)),s=o?path.join(i,"output-file.txt"):i):(e.length>4&&errors.showError("ARG_COUNT_MORE"),fs.existsSync(e[2])&&fs.statSync(e[2]).isFile()&&o||errors.showError("UNDO_ARGS"),n=e[2],s=i),[n,s]}}}();