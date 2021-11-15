var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { constants, readConfigAsync } from '@create-figma-plugin/common';
import fs from 'fs-extra';
import { resolve } from 'path';
export function buildManifestAsync(minify) {
    return __awaiter(this, void 0, void 0, function () {
        var config, build, enablePrivatePluginApi, enableProposedApi, name, commandId, main, ui, menu, relaunchButtons, parameters, parameterOnly, api, permissions, editorType, id, widgetApi, containsWidget, command, hasUi, manifest, result, string;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readConfigAsync()];
                case 1:
                    config = _a.sent();
                    build = config.build, enablePrivatePluginApi = config.enablePrivatePluginApi, enableProposedApi = config.enableProposedApi, name = config.name, commandId = config.commandId, main = config.main, ui = config.ui, menu = config.menu, relaunchButtons = config.relaunchButtons, parameters = config.parameters, parameterOnly = config.parameterOnly, api = config.api, permissions = config.permissions, editorType = config.editorType, id = config.id, widgetApi = config.widgetApi, containsWidget = config.containsWidget;
                    command = { commandId: commandId, main: main, menu: menu, name: name, parameterOnly: parameterOnly, parameters: parameters, ui: ui };
                    if (hasBundle(command, 'main') === false) {
                        throw new Error('Need a `main` entry point');
                    }
                    hasUi = hasBundle(command, 'ui') === true ||
                        (relaunchButtons !== null &&
                            relaunchButtons.filter(function (relaunchButton) {
                                return relaunchButton.ui !== null;
                            }).length > 0);
                    manifest = {
                        api: api,
                        widgetApi: containsWidget === true ? widgetApi : undefined,
                        editorType: editorType,
                        containsWidget: containsWidget === true ? containsWidget : undefined,
                        id: id,
                        name: name,
                        main: constants.build.pluginCodeFilePath,
                        ui: hasUi === true ? constants.build.pluginUiFilePath : undefined,
                        parameters: command.parameters !== null
                            ? createParameters(command.parameters)
                            : undefined,
                        parameterOnly: command.parameterOnly === true ? true : undefined,
                        menu: command.menu !== null ? createMenu(command.menu) : undefined,
                        relaunchButtons: relaunchButtons !== null
                            ? createRelaunchButtons(relaunchButtons)
                            : undefined,
                        permissions: permissions !== null ? permissions : undefined,
                        enableProposedApi: enableProposedApi === true ? true : undefined,
                        enablePrivatePluginApi: enablePrivatePluginApi === true ? true : undefined,
                        build: build !== null ? build : undefined
                    };
                    return [4 /*yield*/, overrideManifestAsync(manifest)];
                case 2:
                    result = _a.sent();
                    string = (minify === true
                        ? JSON.stringify(result)
                        : JSON.stringify(result, null, 2)) + '\n';
                    return [4 /*yield*/, fs.outputFile(constants.build.manifestFilePath, string)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function hasBundle(command, key) {
    if (command[key] !== null) {
        return true;
    }
    if (command.menu !== null) {
        var result = command.menu.filter(function (command) {
            if ('separator' in command) {
                return false;
            }
            return hasBundle(command, key);
        });
        return result.length > 0;
    }
    return false;
}
function createParameters(parameters) {
    return parameters.map(function (parameter) {
        var result = {
            key: parameter.key,
            name: parameter.name
        };
        if (parameter.description !== null) {
            result.description = parameter.description;
        }
        if (parameter.allowFreeform === true) {
            result.allowFreeform = true;
        }
        if (parameter.optional === true) {
            result.optional = true;
        }
        return result;
    });
}
function createMenu(menu) {
    return menu.map(function (item) {
        if ('separator' in item) {
            return { separator: true };
        }
        var result = {
            name: item.name
        };
        if (item.commandId !== null) {
            result.command = item.commandId;
        }
        if (item.parameters !== null) {
            result.parameters = createParameters(item.parameters);
        }
        if (item.parameterOnly === true) {
            result.parameterOnly = true;
        }
        if (item.menu !== null) {
            result.menu = createMenu(item.menu);
        }
        return result;
    });
}
function createRelaunchButtons(relaunchButtons) {
    return relaunchButtons.map(function (relaunchButton) {
        /* eslint-disable sort-keys-fix/sort-keys-fix */
        var result = {
            name: relaunchButton.name,
            command: relaunchButton.commandId
        };
        /* eslint-enable sort-keys-fix/sort-keys-fix */
        if (relaunchButton.multipleSelection === true) {
            result.multipleSelection = true;
        }
        return result;
    });
}
function overrideManifestAsync(manifest) {
    return __awaiter(this, void 0, void 0, function () {
        var absolutePath, overrideManifest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    absolutePath = resolve(constants.build.manifestConfigFilePath);
                    return [4 /*yield*/, fs.pathExists(absolutePath)];
                case 1:
                    if ((_a.sent()) === false) {
                        return [2 /*return*/, manifest];
                    }
                    return [4 /*yield*/, import(absolutePath)];
                case 2:
                    overrideManifest = (_a.sent())["default"];
                    return [2 /*return*/, overrideManifest(manifest)];
            }
        });
    });
}
