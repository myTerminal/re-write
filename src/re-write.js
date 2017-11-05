/* global require module Buffer */

var fs = require('fs'),
    path = require('path'),
    prompt = require('readline-sync'),
    md5 = require('md5'),
    mkdirp = require('mkdirp'),
    errors = require('./errors');

module.exports = (function () {
    var nothing,
        delimiters = {
            'main': '<{([0])}>',
            'files': '<{([1])}>',
            'data': '<{([2])}>'
        },
        transforms = [
            {
                transform: function (input) {
                    return createEmptyArray(input.length).map((e, i) => getHexFromByte(input[i])).reduce((a, c) => a + c, '');;
                },
                recover: function (transformedInput) {
                    return Buffer.from(createEmptyArray(transformedInput.length / 2).map((e, i) => getByteFromHex(transformedInput.substr(i * 2, 2))));
                }
            }
        ],
        createEmptyArray = function (length) {
            return new Array(length).join(',').split(',');
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
                pathsToTry = createEmptyArray(segments).map((n, i) => segments.slice(0, i + 1).join('/')),
                baseDirectories = pathsToTry.filter(p => filePaths.filter(f => f.indexOf(p) === 0).length === filePaths.length).reverse();

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
        encryptOrDecryptText = function (text, password) {
            return !password
                ? text
                : text.split('').map((c, i) => {
                    return String.fromCharCode(c.charCodeAt(0) ^ password.charCodeAt(i % password.length));
                }).join('');
        },
        doIt = function (inputFilePaths, outputFilePath) {
            var latestTransformIndex = transforms.length - 1,
                transform = transforms[latestTransformIndex].transform,
                password = prompt.question('If you want to use a password, enter it: ', { hideEchoBack: true }),
                metadata = '' + latestTransformIndex + ',' + (password && md5(password)),
                textFromFiles = inputFilePaths.map(f =>
                                                   f + delimiters.data + transform(fs.readFileSync(f))
                                                  ).join(delimiters.files),
                encryptedText = encryptOrDecryptText(textFromFiles, password);

            fs.writeFileSync(outputFilePath, metadata + delimiters.main + encryptedText);
        },
        undoIt = function (inputFilePath, outputDirectoryPath) {
            var inputFileText = fs.readFileSync(inputFilePath).toString(),
                parsedInputText = inputFileText.split(delimiters.main),
                metadata = parsedInputText[0].split(','),
                transformIndex = +metadata[0],
                transform = transforms[transformIndex],
                usedPasswordHash = metadata[1],
                password = usedPasswordHash ? prompt.question('Enter the password used while re-writing: ', { hideEchoBack: true}) : '';

            if (usedPasswordHash && usedPasswordHash !== md5(password)) {
                errors.showError('INCORRECT_PASSWORD');
            }

            var data = encryptOrDecryptText(parsedInputText[1], password),
                outputFilesData = data.split(delimiters.files).map(d => {
                    var parts = d.split(delimiters.data);

                    return {
                        name: parts[0],
                        content: transform.recover(parts[1])
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
