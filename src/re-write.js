/* global require module */

var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp');

module.exports = (function () {
    var temp,
        getBaseDirectory = function (filePaths) {
            var firstPath = filePaths[0],
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
        transformString = function (inputString) {
            return inputString;
        },
        recoverString = function (transformedString) {
            return transformedString;
        },
        doIt = function (inputFilePaths, outputFilePath) {
            var textFromFiles = inputFilePaths
                .map(f =>
                     f + '<{([0])}>' + fs.readFileSync(f).toString()
                    ).join('<{([1])}>');
            fs.writeFileSync(outputFilePath, transformString(textFromFiles));
        },
        undoIt = function (inputFilePath, outputDirectoryPath) {
            var inputFileText = fs.readFileSync(inputFilePath).toString(),
                outputFilesData = recoverString(inputFileText).split('<{([1])}>')
                .map(d => {
                    var parts = d.split('<{([0])}>');

                    return {
                        name: parts[0],
                        content: parts[1]
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
