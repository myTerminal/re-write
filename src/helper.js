/* global module require */

const fs = require('fs'),
    path = require('path'),
    io = require('./interface'),
    reWrite = require('./re-write');

const getFilesInDirectory = (dir, filelist) => {
    const files = fs.readdirSync(dir);

    filelist = filelist || [];

    files.forEach(
        file => {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                filelist = getFilesInDirectory(path.join(dir, file), filelist);
            } else {
                filelist.push(path.join(dir, file));
            }
        }
    );

    return filelist;
};

const inflateInput = inputs =>
    inputs.map(
        input => {
            if (fs.lstatSync(input).isDirectory()) {
                return getFilesInDirectory(input);
            } else {
                return [input];
            }
        }
    ).reduce(
        (a, c) => a.concat(c),
        []
    );

module.exports.getInputAndOutputItems = (action, args) => {
    let input,
        output,
        lastArgument = args.slice(0).pop(),
        isLastArgumentADirectory = fs.existsSync(lastArgument) && fs.statSync(lastArgument).isDirectory(),
        isInputAFile;

    if (args.length < 2) {
        io.showError('ARG_COUNT_LESS');
    }

    if (action === reWrite.doIt) {
        input = inflateInput(args.slice(0, args.length - 1));

        if (isLastArgumentADirectory) {
            output = path.join(lastArgument, 'output-file.txt');
        } else {
            output = lastArgument;
        }
    } else {
        if (args.length > 2) {
            io.showError('ARG_COUNT_MORE');
        }

        isInputAFile = fs.existsSync(args[0]) && fs.statSync(args[0]).isFile();

        if (!isInputAFile || !isLastArgumentADirectory) {
            io.showError('UNDO_ARGS');
        }

        input = args[0];
        output = lastArgument;
    }

    return [
        input,
        output
    ];
};
