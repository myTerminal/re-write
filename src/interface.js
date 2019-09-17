/* global module process */

module.exports.errors = {
    ARG_COUNT_LESS: 'You supplied an insufficient number of inputs parameters',
    ARG_COUNT_MORE: 'You supplied too many input parameters',
    UNDO_ARGS_INVALID: 'You supplied invalid input. Specify a source file and a target directory',
    PATH_DOES_NOT_EXIST: 'Path does not exist',
    TARGET_FILE_EXISTS: 'Target file already exists',
    UNRECOGNIZED_TRANSFORM: 'The file cannot be (un)re-written. Please try with a newer version.',
    INCORRECT_PASSWORD: 'The password does not match with the one used while re-writing'
};

module.exports.showMessage = (...args) => {
    console.log(args.join(' '));
};

module.exports.showError = (errorString, shouldQuit = true) => {
    console.log('\n[Error]', errorString, '\n');

    if (shouldQuit) {
        process.exit();
    }
};
