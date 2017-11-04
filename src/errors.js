/* global module process */

module.exports = (function () {
    var errors = {
        'ARG_COUNT_LESS': 'You supplied insufficient number of inputs.',
        'ARG_COUNT_MORE': 'You supplied too many inputs.',
        'DO_ARGS': 'You supplied an invalid input. Specify source files or directories and a target file or directory.',
        'UNDO_ARGS': 'You supplied an invalid input. Specify a source file and a target directory.',
        'INVALID_SOURCE': 'You supplied an invalid source.'
    },
        showError = function (errorString) {
            console.log('[Error]', errors[errorString]);
            process.exit();
        };

    return {
        showError: showError
    };
})();
