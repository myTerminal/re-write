/* global module require */

var fs = require('fs'),
    path = require('path'),
    errors = require('./errors'),
    reWrite = require('./re-write');

module.exports = (function () {
    var nothing,
        getFilesInDirectory = function (dir, filelist) {
            var files = fs.readdirSync(dir);

            filelist = filelist || [];

            files.forEach(function (file) {
                if (fs.statSync(path.join(dir, file)).isDirectory()) {
                    filelist = getFilesInDirectory(path.join(dir, file), filelist);
                } else {
                    filelist.push(path.join(dir, file));
                }
            });

            return filelist;
        },
        inflateInput = function (inputs) {
            return inputs.map(input => {
                if (fs.lstatSync(input).isDirectory()) {
                    return getFilesInDirectory(input);
                } else {
                    return [input];
                }
            }).reduce((a, c) => a.concat(c), []);
        },
        getInputAndOutputItems = function (action, args) {
            var input,
                output,
                lastArgument = args.slice(0).pop(),
                isLastArgumentADirectory = fs.existsSync(lastArgument) && fs.statSync(lastArgument).isDirectory(),
                isInputAFile;

            if (args.length < 4) {
                errors.showError('ARG_COUNT_LESS');
            }

            if (action === reWrite.doIt) {

                input = inflateInput(args.slice(2, args.length - 1));

                if (isLastArgumentADirectory) {
                    output = path.join(lastArgument, 'output-file.txt');
                } else {
                    output = lastArgument;
                }
            }
            else {

                if (args.length > 4) {
                    errors.showError('ARG_COUNT_MORE');
                }

                isInputAFile = fs.existsSync(args[2]) && fs.statSync(args[2]).isFile();

                if (!isInputAFile || !isLastArgumentADirectory) {
                    errors.showError('UNDO_ARGS');
                }

                input = args[2];
                output = lastArgument;
            }

            return [
                input,
                output
            ];
        };

    return {
        getInputAndOutputItems: getInputAndOutputItems
    };
})();
