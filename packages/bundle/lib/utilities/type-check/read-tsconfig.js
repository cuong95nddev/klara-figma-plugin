import fs from 'fs';
import { dirname } from 'path';
import ts from 'typescript';
import { formatTypeScriptErrorMessage } from './format-typescript-error-message.js';
var parseConfigHost = {
    fileExists: ts.sys.fileExists,
    readDirectory: ts.sys.readDirectory,
    readFile: ts.sys.readFile,
    useCaseSensitiveFileNames: true
};
export function readTsConfig() {
    var tsConfigFilePath = ts.findConfigFile(process.cwd(), ts.sys.fileExists, 'tsconfig.json');
    if (typeof tsConfigFilePath === 'undefined') {
        throw new Error('Need a `tsconfig.json`');
    }
    var jsonConfigFile = ts.readJsonConfigFile(tsConfigFilePath, function (path) {
        return fs.readFileSync(path, 'utf8');
    });
    var result = ts.parseJsonSourceFileConfigFileContent(jsonConfigFile, parseConfigHost, dirname(tsConfigFilePath));
    if (result.errors.length > 0) {
        throw new Error(formatTypeScriptErrorMessage(result.errors));
    }
    return {
        compilerOptions: result.options,
        filePaths: result.fileNames,
        tsConfigFilePath: tsConfigFilePath
    };
}
