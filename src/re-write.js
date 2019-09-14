/* global require module Buffer */

const fs = require('fs');
const path = require('path');
const prompt = require('readline-sync');
const md5 = require('md5');

const mkdirp = require('mkdirp');
const io = require('./interface');

const delimiters = {
    main: '<{([0])}>',
    files: '<{([1])}>',
    data: '<{([2])}>'
};

const transforms = [
    {
        transform: input =>
            new Array(input.length).fill('').map((e, i) => getHexFromByte(input[i])).reduce((a, c) => a + c, ''),
        recover: transformedInput =>
            Buffer.from(
                new Array(transformedInput.length / 2).fill('')
                    .map((e, i) => getByteFromHex(transformedInput.substr(i * 2, 2)))
            )
    }
];

// Function to convert byte to hex
const getHexFromByte = input => (`0${input.toString(16)}`).slice(-2);

// Function to convert hex to byte
const getByteFromHex = input => parseInt(input, 16);

// Function to determine common directory between input file paths
const getBaseDirectory = filePaths => {
    const firstPath = path.dirname(filePaths[0]),
        segments = firstPath.split('/'),
        pathsToTry = new Array(segments).fill('').map((n, i) => segments.slice(0, i + 1).join('/')),
        baseDirectories = pathsToTry.filter(
            p => filePaths.filter(f => f.indexOf(p) === 0).length === filePaths.length
        ).reverse();

    return baseDirectories[0] || '.';
};

// Function to remove '..' from paths
const getLiftedFilePaths = filePaths =>
    filePaths.map(p => p.split('/').filter(s => s !== '..').join('/'));

// Function to file paths relative to a base directory
const getRelativePaths = (filePaths, baseDirectory) =>
    filePaths.map(p => path.relative(baseDirectory, p));

// Function to get absolute file paths for an output directory
const getFinalFilePaths = (filePaths, outputDirectoryPath) =>
    filePaths.map(p => path.join(outputDirectoryPath, p));

// Function to encrypt text if provided with a password
const encryptOrDecryptText = (text, password) => {
    if (!password) {
        return text;
    } else {
        return text.split('').map(
            (c, i) => String.fromCharCode(c.charCodeAt(0)
                 ^ password.charCodeAt(i % password.length))
        ).join('');
    }
};

// Function to transform input files to an output file
module.exports.doIt = (inputFilePaths, outputFilePath) => {
    const latestTransformIndex = transforms.length - 1;
    const { transform } = transforms[latestTransformIndex];
    const password = prompt.question('Enter a password if you want to use one: ', { hideEchoBack: true });
    const metadata = `${latestTransformIndex},${(password && md5(password))}`;
    const textFromFiles = inputFilePaths.map(
        f => f + delimiters.data + transform(fs.readFileSync(f))
    ).join(delimiters.files);
    const encryptedText = encryptOrDecryptText(textFromFiles, password);

    io.showMessage(inputFilePaths.length, 'input files provided');

    // Do the final re-write
    fs.writeFileSync(outputFilePath, metadata + delimiters.main + encryptedText);

    io.showMessage('Data re-written at', outputFilePath);
};

// Function to untransform an input file to an output directory
module.exports.undoIt = (inputFilePath, outputDirectoryPath) => {
    const inputFileText = fs.readFileSync(inputFilePath).toString();
    const parsedInputText = inputFileText.split(delimiters.main);
    const [transformIndex, usedPasswordHash] = parsedInputText[0].split(',');
    const { recover } = transforms[+transformIndex];
    const password = usedPasswordHash ? prompt.question('Enter a password to (un)re-write: ', { hideEchoBack: true }) : '';

    // Validate the provided password
    if (usedPasswordHash && usedPasswordHash !== md5(password)) {
        io.showError('INCORRECT_PASSWORD');
    }

    const data = encryptOrDecryptText(parsedInputText[1], password);
    const outputFilesData = data.split(delimiters.files).map(
        d => {
            const parts = d.split(delimiters.data);

            return {
                name: parts[0],
                content: recover(parts[1])
            };
        }
    );
    const fetchedFilePaths = outputFilesData.map(d => d.name);
    const baseDirectory = getBaseDirectory(fetchedFilePaths);
    const liftedFilePaths = getLiftedFilePaths(fetchedFilePaths);
    const relativeFilePaths = getRelativePaths(liftedFilePaths, baseDirectory);
    const finalFilePaths = getFinalFilePaths(relativeFilePaths, outputDirectoryPath);

    io.showMessage(finalFilePaths.length, 'files to be (un)re-written');

    // Do the (un)re-write
    finalFilePaths.forEach(
        (p, i) => {
            mkdirp.sync(path.dirname(p));
            fs.writeFileSync(p, outputFilesData[i].content);
        }
    );

    io.showMessage('(Un)re-written data placed at', outputDirectoryPath);
};
