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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { constants, readConfigAsync, } from "@create-figma-plugin/common";
import indentString from "indent-string";
import { join } from "path";
import webpack from "webpack";
import VirtualModulesPlugin from "webpack-virtual-modules";
export function buildBundlesAsync(prod) {
    return __awaiter(this, void 0, void 0, function () {
        var config;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readConfigAsync()];
                case 1:
                    config = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            buildMainBundleAsync({
                                config: config,
                                prod: prod
                            }),
                            buildUiBundleAsync({
                                config: config,
                                prod: prod
                            }),
                        ])];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function buildMainBundleAsync(options) {
    return __awaiter(this, void 0, void 0, function () {
        var config, prod, js, virtualModules, webpackOptions, compiler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = options.config, prod = options.prod;
                    js = createMainEntryFile(config);
                    virtualModules = new VirtualModulesPlugin({ "./main.js": js });
                    webpackOptions = {
                        mode: prod ? "production" : "development",
                        devtool: prod ? false : "inline-source-map",
                        entry: {
                            app: ["@babel/polyfill", "./main.js"]
                        },
                        output: {
                            path: join(process.cwd(), constants.build.buildDirectoryName),
                            filename: "main.js"
                        },
                        module: {
                            rules: [
                                {
                                    test: /\.js?$/,
                                    exclude: /(node_modules)/,
                                    use: {
                                        loader: "babel-loader",
                                        options: {
                                            presets: ["@babel/preset-env"]
                                        }
                                    }
                                },
                                {
                                    test: /\.tsx?$/,
                                    use: "ts-loader",
                                    exclude: /node_modules/
                                },
                                {
                                    test: /\.m?js/,
                                    resolve: {
                                        fullySpecified: false
                                    }
                                },
                            ]
                        },
                        resolve: {
                            extensions: [".tsx", ".ts", ".js", ".mjs"]
                        },
                        plugins: [virtualModules]
                    };
                    compiler = webpack(webpackOptions);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            compiler.run(function (err, stats) {
                                if (err) {
                                    throw err;
                                }
                                compiler.close(function (closeErr) {
                                    resolve(null);
                                });
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createMainEntryFile(config) {
    var relaunchButtons = config.relaunchButtons, command = __rest(config, ["relaunchButtons"]);
    var entryFiles = [];
    extractEntryFile(command, "main", entryFiles);
    if (entryFiles.length === 0) {
        throw new Error("Need a `main` entry point");
    }
    if (relaunchButtons !== null) {
        extractEntryFiles(relaunchButtons, "main", entryFiles);
    }
    return "\n    const modules = " + createRequireCode(entryFiles) + ";\n    const commandId = (" + (entryFiles.length === 1) + " || typeof figma.command === 'undefined' || figma.command === '') ? '" + entryFiles[0].commandId + "' : figma.command;\n    modules[commandId]();\n  ";
}
function buildUiBundleAsync(options) {
    return __awaiter(this, void 0, void 0, function () {
        var config, prod, js, virtualModules, webpackOptions, compiler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    config = options.config, prod = options.prod;
                    js = createUiEntryFile(config);
                    if (js === null) {
                        return [2 /*return*/];
                    }
                    virtualModules = new VirtualModulesPlugin({ "./ui.js": js });
                    webpackOptions = {
                        mode: prod ? "production" : "development",
                        devtool: prod ? false : "inline-source-map",
                        entry: {
                            app: ["./ui.js"]
                        },
                        output: {
                            path: join(process.cwd(), constants.build.buildDirectoryName),
                            filename: "ui.js"
                        },
                        module: {
                            rules: [
                                {
                                    test: /\.tsx?$/,
                                    use: "ts-loader",
                                    exclude: /node_modules/
                                },
                                {
                                    test: /\.css$/,
                                    use: [
                                        "style-loader",
                                        {
                                            loader: "css-loader"
                                        },
                                    ]
                                },
                                {
                                    test: /\.(png|jpg|gif|webp|svg|glb)$/,
                                    loader: "url-loader"
                                },
                                {
                                    test: /\.m?js/,
                                    resolve: {
                                        fullySpecified: false
                                    }
                                },
                            ]
                        },
                        resolve: {
                            extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs"]
                        },
                        plugins: [virtualModules]
                    };
                    compiler = webpack(webpackOptions);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            compiler.run(function (err, stats) {
                                if (err) {
                                    throw err;
                                }
                                compiler.close(function (closeErr) {
                                    resolve(null);
                                });
                            });
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createUiEntryFile(config) {
    var relaunchButtons = config.relaunchButtons, command = __rest(config, ["relaunchButtons"]);
    var modules = [];
    extractEntryFile(command, "ui", modules);
    if (relaunchButtons !== null) {
        extractEntryFiles(relaunchButtons, "ui", modules);
    }
    if (modules.length === 0) {
        return null;
    }
    return "\n    const rootNode = document.getElementById('create-figma-plugin');\n    const modules = " + createRequireCode(modules) + ";\n    const commandId = __FIGMA_COMMAND__ === '' ? '" + modules[0].commandId + "' : __FIGMA_COMMAND__;\n    if (typeof modules[commandId] === 'undefined') {\n      throw new Error(\n        'No UI defined for command `' + commandId + '`'\n      );\n    }\n    modules[commandId](rootNode, __SHOW_UI_DATA__);\n  ";
}
function extractEntryFiles(items, key, result) {
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        if ("separator" in item) {
            continue;
        }
        extractEntryFile(item, key, result);
    }
}
function extractEntryFile(command, key, result) {
    var commandId = command.commandId;
    if (commandId !== null) {
        var item = command[key];
        if (item !== null) {
            var src = item.src, handler = item.handler;
            result.push({
                commandId: commandId,
                handler: handler,
                src: src
            });
        }
    }
    if ("menu" in command && command.menu !== null) {
        extractEntryFiles(command.menu, key, result);
    }
}
function createRequireCode(entryFiles) {
    var code = [];
    for (var _i = 0, entryFiles_1 = entryFiles; _i < entryFiles_1.length; _i++) {
        var entryFile = entryFiles_1[_i];
        code.push("'" + entryFile.commandId + "':require('./" + entryFile.src + "')['" + entryFile.handler + "']");
    }
    return "{" + code.join(",") + "}";
}
function formatEsbuildErrorMessage(string) {
    return "esbuild error\n" + indentString(string, 4);
}
