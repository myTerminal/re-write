/* global module require */

const fs = require('fs');
const path = require('path');

const { showError, errors } = require('./interface');
const reWrite = require('./re-write');

const defaultOutputFileName = 'output-file.txt';
const defaultOutputDirectory = './';

// Recursively get a list of files in a directory
const getFilesInDirectory = dir =>
    fs.readdirSync(dir)
        .map(
            file =>
                (fs.statSync(path.join(dir, file)).isDirectory()
                    ? getFilesInDirectory(path.join(dir, file))
                    : [path.join(dir, file)])
        )
        .reduce(
            (a, c) => a.concat(c),
            []
        );

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

// Function to determine whether a file-system item is a directory
const isDirectory = f => fs.existsSync(f) && fs.statSync(f).isDirectory();

// Function to determine whether a file-system item is a file
const isFile = f => fs.existsSync(f) && fs.statSync(f).isFile();

// Function to throw error if a path exists
const throwErrorIfDoesNotExists = input => {
    if (!fs.existsSync(input)) {
        showError(`${errors.PATH_DOES_NOT_EXIST}: ${input}`);
    }
};

// Function to extract input and output for transform operation
const getInputAndOutputForTransform = args => {
    // Validate that there are at least two arguments
    if (args.length < 2) {
        showError(errors.ARG_COUNT_LESS);
    }

    // Extract the input arguments
    const inputArgs = args.slice(0, args.length - 1);

    // Validate that all input paths exist
    inputArgs.forEach(throwErrorIfDoesNotExists);

    // Extract the target
    const target = args.slice(0).pop();

    // Validate that the target file does not exist
    if (isFile(target)) {
        showError(errors.TARGET_FILE_EXISTS);
    }

    return [
        inflateInput(inputArgs),
        isDirectory(target) ? path.join(target, defaultOutputFileName) : target
    ];
};

// Function to extract input and output for recover operation
const getInputAndOutputForRecover = args => {
    // Validate that there are at most two arguments
    if (args.length > 2) {
        showError(errors.ARG_COUNT_MORE);
    }

    // Validate that there is at least one argument
    if (args.length < 1) {
        showError(errors.ARG_COUNT_LESS);
    }

    // Validate input
    if (!isFile(args[0]) || (args.length > 1 && !isDirectory(args[1]))) {
        showError(errors.UNDO_ARGS_INVALID);
    }

    return args.length === 2
        ? args // Use the same arguments
        : args.concat([defaultOutputDirectory]); // Use default output directory for target
};

// Function to extract input and output from arguments
module.exports.getInputAndOutputItems = (action, args) =>
    (action === reWrite.doIt
        ? getInputAndOutputForTransform(args)
        : getInputAndOutputForRecover(args));
