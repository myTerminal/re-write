/* global module require */

const fs = require('fs');
const path = require('path');

const io = require('./interface');
const reWrite = require('./re-write');

const defaultOutputFileName = 'output-file.txt';

// Recursively get a list of files in a directory
const getFilesInDirectory = (dir, filelist) => {
    const files = fs.readdirSync(dir);

    // Start with an empty collection
    filelist = filelist || [];

    files.forEach(
        file => {
            if (fs.statSync(path.join(dir, file)).isDirectory()) {
                // Recursive call for child directory
                filelist = getFilesInDirectory(path.join(dir, file), filelist);
            } else {
                // Add current file to the collection
                filelist.push(path.join(dir, file));
            }
        }
    );

    return filelist;
};

// Inflate input paths to be file paths
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

// Extract input and output from arguments
module.exports.getInputAndOutputItems = (action, args) => {
    let input,
        output,
        isInputAFile;

    const lastArgument = args.slice(0).pop();
    const isLastArgumentADirectory = fs.existsSync(lastArgument)
        && fs.statSync(lastArgument).isDirectory();

    // Validate that there are at least two arguments
    if (args.length < 2) {
        io.showError('ARG_COUNT_LESS');
    }

    if (action === reWrite.doIt) { // Transform event
        // Get input file paths
        input = inflateInput(args.slice(0, args.length - 1));

        // Generate output filename
        if (isLastArgumentADirectory) {
            output = path.join(lastArgument, defaultOutputFileName);
        } else {
            output = lastArgument;
        }
    } else { // Untransform event
        // Validate that there are at most two arguments
        if (args.length > 2) {
            io.showError('ARG_COUNT_MORE');
        }

        isInputAFile = fs.existsSync(args[0]) && fs.statSync(args[0]).isFile();

        // Validate input
        if (!isInputAFile || !isLastArgumentADirectory) {
            io.showError('UNDO_ARGS');
        }

        // Finally generate input and output parameters
        [input] = args;
        output = lastArgument;
    }

    return [
        input,
        output
    ];
};
