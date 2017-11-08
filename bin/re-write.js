"use strict";var fs=require("fs"),path=require("path"),prompt=require("readline-sync"),md5=require("md5"),mkdirp=require("mkdirp"),io=require("./interface");module.exports=function(){var n={main:"<{([0])}>",files:"<{([1])}>",data:"<{([2])}>"},r=[{transform:function(n){return t(n.length).map(function(r,t){return e(n[t])}).reduce(function(n,r){return n+r},"")},recover:function(n){return Buffer.from(t(n.length/2).map(function(r,t){return i(n.substr(2*t,2))}))}}],t=function(n){return new Array(n).join(",").split(",")},e=function(n){return("0"+n.toString(16)).slice(-2)},i=function(n){return parseInt(n,16)},o=function(n){var r=path.dirname(n[0]).split("/");return t(r).map(function(n,t){return r.slice(0,t+1).join("/")}).filter(function(r){return n.filter(function(n){return 0===n.indexOf(r)}).length===n.length}).reverse()[0]||"."},u=function(n){return n.map(function(n){return n.split("/").filter(function(n){return".."!==n}).join("/")})},a=function(n,r){return n.map(function(n){return path.relative(r,n)})},s=function(n,r){return n.map(function(n){return path.join(r,n)})},f=function(n,r){return r?n.split("").map(function(n,t){return String.fromCharCode(n.charCodeAt(0)^r.charCodeAt(t%r.length))}).join(""):n};return{doIt:function(t,e){var i=r.length-1,o=r[i].transform,u=prompt.question("If you want to use a password, enter it: ",{hideEchoBack:!0}),a=i+","+(u&&md5(u)),s=t.map(function(r){return r+n.data+o(fs.readFileSync(r))}).join(n.files),c=f(s,u);io.showMessage(t.length,"input files provided"),fs.writeFileSync(e,a+n.main+c),io.showMessage("Data re-written at",e)},undoIt:function(t,e){var i=fs.readFileSync(t).toString().split(n.main),c=i[0].split(","),p=+c[0],l=r[p],d=c[1],m=d?prompt.question("Enter the password used while re-writing: ",{hideEchoBack:!0}):"";d&&d!==md5(m)&&io.showError("INCORRECT_PASSWORD");var h=f(i[1],m).split(n.files).map(function(r){var t=r.split(n.data);return{name:t[0],content:l.recover(t[1])}}),g=h.map(function(n){return n.name}),w=o(g),v=u(g),S=a(v,w),q=s(S,e);io.showMessage(q.length,"files to be (un)re-written"),q.forEach(function(n,r){mkdirp.sync(path.dirname(n)),fs.writeFileSync(n,h[r].content)}),io.showMessage("(Un)re-written data placed at",e)}}}();