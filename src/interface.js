/* global module process */

const errors = {
    ARG_COUNT_LESS: 'You supplied an insufficient number of inputs parameters.',
    ARG_COUNT_MORE: 'You supplied too many input parameters.',
    UNDO_ARGS_INVALID: 'You supplied invalid input. Specify a source file and a target directory.',
    TARGET_FILE_EXISTS: 'Target file already exists.',
    INCORRECT_PASSWORD: 'The password does not match with the one used while re-writing'
};

module.exports.errors = errors;

module.exports.showMessage = (...args) => {
    console.log(args.join(' '));
};

module.exports.showError = errorString => {
    console.log('\n[Error]', errorString, '\n');
    process.exit();
};
