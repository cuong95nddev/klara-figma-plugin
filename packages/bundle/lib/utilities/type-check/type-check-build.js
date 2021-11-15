var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import ts from 'typescript';
import { filterTypeScriptDiagnostics } from './filter-typescript-diagnostics.js';
import { formatTypeScriptErrorMessage } from './format-typescript-error-message.js';
import { readTsConfig } from './read-tsconfig.js';
export function typeCheckBuild() {
    var tsConfig = readTsConfig();
    var compilerOptions = __assign(__assign({}, tsConfig.compilerOptions), { configFilePath: tsConfig.tsConfigFilePath, noEmit: true });
    if (tsConfig.filePaths.length === 0) {
        return;
    }
    var program = ts.createProgram(tsConfig.filePaths, compilerOptions);
    var diagnostics = filterTypeScriptDiagnostics(ts.getPreEmitDiagnostics(program).slice());
    if (diagnostics.length === 0) {
        return;
    }
    throw new Error(formatTypeScriptErrorMessage(diagnostics));
}
