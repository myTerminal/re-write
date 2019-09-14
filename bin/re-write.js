"use strict";var _slicedToArray=function(e,t){if(Array.isArray(e))return e;if(Symbol.iterator in Object(e))return function(e,t){var r=[],n=!0,i=!1,o=void 0;try{for(var a,s=e[Symbol.iterator]();!(n=(a=s.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e}finally{try{!n&&s.return&&s.return()}finally{if(i)throw o}}return r}(e,t);throw new TypeError("Invalid attempt to destructure non-iterable instance")},fs=require("fs"),path=require("path"),prompt=require("readline-sync"),md5=require("md5"),mkdirp=require("mkdirp"),io=require("./interface"),delimiters={main:"<{([0])}>",files:"<{([1])}>",data:"<{([2])}>"},transforms=[{transform:function(r){return new Array(r.length).fill("").map(function(e,t){return getHexFromByte(r[t])}).reduce(function(e,t){return e+t},"")},recover:function(r){return Buffer.from(new Array(r.length/2).fill("").map(function(e,t){return getByteFromHex(r.substr(2*t,2))}))}}],getHexFromByte=function(e){return("0"+e.toString(16)).slice(-2)},getByteFromHex=function(e){return parseInt(e,16)},getBaseDirectory=function(e){var r=path.dirname(e[0]).split("/");return new Array(r).fill("").map(function(e,t){return r.slice(0,t+1).join("/")}).filter(function(t){return e.filter(function(e){return 0===e.indexOf(t)}).length===e.length}).reverse()[0]||"."},getLiftedFilePaths=function(e){return e.map(function(e){return e.split("/").filter(function(e){return".."!==e}).join("/")})},getRelativePaths=function(e,t){return e.map(function(e){return path.relative(t,e)})},getFinalFilePaths=function(e,t){return e.map(function(e){return path.join(t,e)})},encryptOrDecryptText=function(e,r){return r?e.split("").map(function(e,t){return String.fromCharCode(e.charCodeAt(0)^r.charCodeAt(t%r.length))}).join(""):e};module.exports.doIt=function(e,t){var r=transforms.length-1,n=transforms[r].transform,i=prompt.question("Enter a password if you want to use one: ",{hideEchoBack:!0}),o=r+","+(i&&md5(i)),a=e.map(function(e){return e+delimiters.data+n(fs.readFileSync(e))}).join(delimiters.files),s=encryptOrDecryptText(a,i);io.showMessage(e.length,"input files provided"),fs.writeFileSync(t,o+delimiters.main+s),io.showMessage("Data re-written at",t)},module.exports.undoIt=function(e,t){var r=fs.readFileSync(e).toString().split(delimiters.main),n=r[0].split(","),i=_slicedToArray(n,2),o=i[0],a=i[1],s=transforms[+o].recover,u=a?prompt.question("Enter a password to (un)re-write: ",{hideEchoBack:!0}):"";a&&a!==md5(u)&&io.showError("INCORRECT_PASSWORD");var f=encryptOrDecryptText(r[1],u).split(delimiters.files).map(function(e){var t=e.split(delimiters.data);return{name:t[0],content:s(t[1])}}),l=f.map(function(e){return e.name}),c=getBaseDirectory(l),m=getLiftedFilePaths(l),p=getRelativePaths(m,c),d=getFinalFilePaths(p,t);io.showMessage(d.length,"files to be (un)re-written"),d.forEach(function(e,t){mkdirp.sync(path.dirname(e)),fs.writeFileSync(e,f[t].content)}),io.showMessage("(Un)re-written data placed at",t)};