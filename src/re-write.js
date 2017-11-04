/* global require module */

var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp');

module.exports = (function () {
    var temp,
        delimiters = {
            'main': '<{([0])}>',
            'files': '<{([1])}>',
            'data': '<{([2])}>'
        },
        getHexFromByte = function (input) {
            return ('0' + input.toString(16)).slice(-2);
        },
        getByteFromHex = function (input) {
            return parseInt(input, 16);
        },
        getBaseDirectory = function (filePaths) {
            var firstPath = path.dirname(filePaths[0]),
                segments = firstPath.split('/'),
                pathsToTry = new Array(segments).join(',').split(',').map((n, i) => segments.slice(0, i + 1).join('/')),
                baseDirectories = pathsToTry.filter(p => filePaths.filter(f => f.indexOf(p) ===0).length === filePaths.length).reverse();

            return baseDirectories[0] || '.';
        },
        getLiftedFilePaths = function (filePaths) {
            return filePaths.map(p => p.split('/').filter(s => s !== '..').join('/'));
        },
        getRelativePaths = function (filePaths, baseDirectory) {
            return filePaths.map(p => path.relative(baseDirectory, p));
        },
        getFinalFilePaths = function (filePaths, outputDirectoryPath) {
            return filePaths.map(p => path.join(outputDirectoryPath, p));
        },
        transformFileContents = function (input) {
            return new Array(input.length).join(',').split(',').map((e, i) => getHexFromByte(input[i])).reduce((a, c) => a + c, '');;
        },
        recoverFileContents = function (transformedInput) {
            return Buffer.from(new Array(transformedInput.length / 2).join(',').split(',').map((e, i) => getByteFromHex(transformedInput.substr(i * 2, 2))));
        },
        doIt = function (inputFilePaths, outputFilePath) {
            var textFromFiles = inputFilePaths
                .map(f =>
                     f + delimiters.data + transformFileContents(fs.readFileSync(f))
                    ).join(delimiters.files);

            fs.writeFileSync(outputFilePath, textFromFiles);
        },
        undoIt = function (inputFilePath, outputDirectoryPath) {
            var inputFileText = fs.readFileSync(inputFilePath).toString(),
                outputFilesData = inputFileText.split(delimiters.files)
                .map(d => {
                    var parts = d.split(delimiters.data);

                    return {
                        name: parts[0],
                        content: recoverFileContents(parts[1])
                    };
                }),
                fetchedFilePaths = outputFilesData.map(d => d.name),
                baseDirectory = getBaseDirectory(fetchedFilePaths),
                liftedFilePaths = getLiftedFilePaths(fetchedFilePaths),
                relativeFilePaths = getRelativePaths(liftedFilePaths, baseDirectory),
                finalFilePaths = getFinalFilePaths(relativeFilePaths, outputDirectoryPath);

            finalFilePaths.forEach((p, i) => {
                mkdirp.sync(path.dirname(p));
                fs.writeFileSync(p, outputFilesData[i].content);
            });
        };

    return {
        doIt: doIt,
        undoIt: undoIt
    };
})();
