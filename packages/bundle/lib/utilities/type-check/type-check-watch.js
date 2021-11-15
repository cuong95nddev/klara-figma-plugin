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
import { log } from '@create-figma-plugin/common';
import tempy from 'tempy';
import ts from 'typescript';
import { trackElapsedTime } from '../track-elapsed-time.js';
import { filterTypeScriptDiagnostics } from './filter-typescript-diagnostics.js';
import { formatTypeScriptErrorMessage } from './format-typescript-error-message.js';
import { readTsConfig } from './read-tsconfig.js';
export function typeCheckWatch() {
    var tsConfig = readTsConfig();
    var compilerOptions = __assign(__assign({}, tsConfig.compilerOptions), { configFilePath: tsConfig.tsConfigFilePath, noEmit: true });
    var getElapsedTime;
    var host = ts.createWatchCompilerHost(tsConfig.tsConfigFilePath, __assign(__assign({}, compilerOptions), { incremental: true, tsBuildInfoFile: tempy.file() }), ts.sys, ts.createSemanticDiagnosticsBuilderProgram, function reportDiagnostic(diagnostic) {
        var diagnostics = filterTypeScriptDiagnostics([diagnostic]);
        if (diagnostics.length === 0) {
            return;
        }
        log.error(formatTypeScriptErrorMessage(diagnostics));
    }, function reportWatchStatus(diagnostic) {
        if (diagnostic.code === 6031 || // 'Starting compilation in watch mode...'
            diagnostic.code === 6032 // 'File change detected. Starting incremental compilation...'
        ) {
            getElapsedTime = trackElapsedTime();
            log.info('Type checking...');
            return;
        }
        if (diagnostic.code === 6194) {
            // 'Found 0 errors. Watching for file changes.'
            log.success("Type checked in " + getElapsedTime(), {
                clearPreviousLine: true
            });
            log.info('Watching...');
            return;
        }
    });
    var watchProgram = ts.createWatchProgram(host);
    return function () {
        watchProgram.close();
    };
}
