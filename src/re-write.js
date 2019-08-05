/* global require module Buffer */

const fs = require('fs'),
    path = require('path'),
    prompt = require('readline-sync'),
    md5 = require('md5'),
    mkdirp = require('mkdirp'),
    io = require('./interface');

const delimiters = {
    main: '<{([0])}>',
    files: '<{([1])}>',
    data: '<{([2])}>'
};

const transforms = [
    {
        transform: input =>
            createEmptyArray(input.length).map((e, i) => getHexFromByte(input[i])).reduce((a, c) => a + c, ''),
        recover: transformedInput =>
            Buffer.from(createEmptyArray(transformedInput.length / 2).map((e, i) => getByteFromHex(transformedInput.substr(i * 2, 2))))
    }
];

const createEmptyArray = length =>
    new Array(length).join(',').split(',');

const getHexFromByte = input =>
    ('0' + input.toString(16)).slice(-2);

const getByteFromHex = input =>
    parseInt(input, 16);

const getBaseDirectory = function (filePaths) {
    var firstPath = path.dirname(filePaths[0]),
        segments = firstPath.split('/'),
        pathsToTry = createEmptyArray(segments).map((n, i) => segments.slice(0, i + 1).join('/')),
        baseDirectories = pathsToTry.filter(p => filePaths.filter(f => f.indexOf(p) === 0).length === filePaths.length).reverse();

    return baseDirectories[0] || '.';
};

const getLiftedFilePaths = filePaths =>
    filePaths.map(p => p.split('/').filter(s => s !== '..').join('/'));

const getRelativePaths = (filePaths, baseDirectory) =>
    filePaths.map(p => path.relative(baseDirectory, p));

const getFinalFilePaths = (filePaths, outputDirectoryPath) =>
    filePaths.map(p => path.join(outputDirectoryPath, p));

const encryptOrDecryptText = (text, password) =>
    !password ?
    text :
    text.split('').map(
        (c, i) => String.fromCharCode(c.charCodeAt(0) ^ password.charCodeAt(i % password.length))
    ).join('');

module.exports.doIt = (inputFilePaths, outputFilePath) => {
    const latestTransformIndex = transforms.length - 1,
        transform = transforms[latestTransformIndex].transform,
        password = prompt.question('If you want to use a password, enter it: ', { hideEchoBack: true }),
        metadata = '' + latestTransformIndex + ',' + (password && md5(password)),
        textFromFiles = inputFilePaths.map(f =>
                                           f + delimiters.data + transform(fs.readFileSync(f))
                                          ).join(delimiters.files),
        encryptedText = encryptOrDecryptText(textFromFiles, password);

    io.showMessage(inputFilePaths.length, 'input files provided');

    fs.writeFileSync(outputFilePath, metadata + delimiters.main + encryptedText);

    io.showMessage('Data re-written at', outputFilePath);
};

module.exports.undoIt = (inputFilePath, outputDirectoryPath) => {
    const inputFileText = fs.readFileSync(inputFilePath).toString(),
        parsedInputText = inputFileText.split(delimiters.main),
        metadata = parsedInputText[0].split(','),
        transformIndex = +metadata[0],
        transform = transforms[transformIndex],
        usedPasswordHash = metadata[1],
        password = usedPasswordHash ? prompt.question('Enter the password used while re-writing: ', { hideEchoBack: true}) : '';

    if (usedPasswordHash && usedPasswordHash !== md5(password)) {
        io.showError('INCORRECT_PASSWORD');
    }

    const data = encryptOrDecryptText(parsedInputText[1], password),
        outputFilesData = data.split(delimiters.files).map(d => {
            const parts = d.split(delimiters.data);

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

    io.showMessage(finalFilePaths.length, 'files to be (un)re-written');

    finalFilePaths.forEach(
        (p, i) => {
            mkdirp.sync(path.dirname(p));
            fs.writeFileSync(p, outputFilesData[i].content);
        }
    );

    io.showMessage('(Un)re-written data placed at', outputDirectoryPath);
};
