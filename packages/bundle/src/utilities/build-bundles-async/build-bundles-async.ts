import {
  Config,
  ConfigCommand,
  ConfigCommandSeparator,
  ConfigFile,
  ConfigRelaunchButton,
  constants,
  readConfigAsync,
} from "@create-figma-plugin/common";
import indentString from "indent-string";
import { join } from "path";
import webpack from "webpack";
import VirtualModulesPlugin from "webpack-virtual-modules";

interface EntryFile extends ConfigFile {
  readonly commandId: string;
}

export async function buildBundlesAsync(
  prod: boolean
): Promise<void> {
  const config = await readConfigAsync();
  await Promise.all([
    buildMainBundleAsync({
      config,
      prod,
    }),
    buildUiBundleAsync({
      config,
      prod,
    }),
  ]);
}

async function buildMainBundleAsync(options: {
  config: Config;
  prod: boolean;
}): Promise<void> {
  const { config, prod } = options;
  const js = createMainEntryFile(config);
  const virtualModules = new VirtualModulesPlugin({ "./main.js": js });
  const webpackOptions: webpack.Configuration = {
    mode: prod ? "production" : "development",
    devtool: prod ? false : "inline-source-map",
    entry: {
      app: ["@babel/polyfill", "./main.js"],
    },
    output: {
      path: join(process.cwd(), constants.build.buildDirectoryName),
      filename: "main.js",
    },
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".mjs"],
    },
    plugins: [virtualModules],
  };

  const compiler = webpack(webpackOptions);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        throw err;
      }

      compiler.close((closeErr) => {
        resolve(null);
      });
    });
  });
}

function createMainEntryFile(config: Config): string {
  const { relaunchButtons, ...command } = config;
  const entryFiles: Array<EntryFile> = [];
  extractEntryFile(command, "main", entryFiles);
  if (entryFiles.length === 0) {
    throw new Error("Need a `main` entry point");
  }
  if (relaunchButtons !== null) {
    extractEntryFiles(relaunchButtons, "main", entryFiles);
  }
  return `
    const modules = ${createRequireCode(entryFiles)};
    const commandId = (${
      entryFiles.length === 1
    } || typeof figma.command === 'undefined' || figma.command === '') ? '${
    entryFiles[0].commandId
  }' : figma.command;
    modules[commandId]();
  `;
}

async function buildUiBundleAsync(options: {
  config: Config;
  prod: boolean;
}): Promise<void> {
  const { config, prod } = options;
  const js = createUiEntryFile(config);
  if (js === null) {
    return;
  }

  const virtualModules = new VirtualModulesPlugin({ "./ui.js": js });

  const webpackOptions: webpack.Configuration = {
    mode: prod ? "production" : "development",
    devtool: prod ? false : "inline-source-map",
    entry: {
      app: ["./ui.js"],
    },
    output: {
      path: join(process.cwd(), constants.build.buildDirectoryName),
      filename: "ui.js",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
            },
          ],
        },
        {
          test: /\.(png|jpg|gif|webp|svg|glb)$/,
          loader: "url-loader",
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", ".mjs"],
    },
    plugins: [virtualModules],
  };

  const compiler = webpack(webpackOptions);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        throw err;
      }

      compiler.close((closeErr) => {
        resolve(null);
      });
    });
  });
}

function createUiEntryFile(config: Config): null | string {
  const { relaunchButtons, ...command } = config;
  const modules: Array<EntryFile> = [];
  extractEntryFile(command, "ui", modules);
  if (relaunchButtons !== null) {
    extractEntryFiles(relaunchButtons, "ui", modules);
  }
  if (modules.length === 0) {
    return null;
  }
  return `
    const rootNode = document.getElementById('create-figma-plugin');
    const modules = ${createRequireCode(modules)};
    const commandId = __FIGMA_COMMAND__ === '' ? '${
      modules[0].commandId
    }' : __FIGMA_COMMAND__;
    if (typeof modules[commandId] === 'undefined') {
      throw new Error(
        'No UI defined for command \`' + commandId + '\`'
      );
    }
    modules[commandId](rootNode, __SHOW_UI_DATA__);
  `;
}

function extractEntryFiles(
  items: Array<ConfigCommandSeparator | ConfigCommand | ConfigRelaunchButton>,
  key: "ui" | "main",
  result: Array<EntryFile>
): void {
  for (const item of items) {
    if ("separator" in item) {
      continue;
    }
    extractEntryFile(item, key, result);
  }
}

function extractEntryFile(
  command: ConfigCommand | ConfigRelaunchButton,
  key: "ui" | "main",
  result: Array<EntryFile>
): void {
  const commandId = command.commandId;
  if (commandId !== null) {
    const item = command[key] as null | ConfigFile;
    if (item !== null) {
      const { src, handler } = item;
      result.push({
        commandId,
        handler,
        src,
      });
    }
  }
  if ("menu" in command && command.menu !== null) {
    extractEntryFiles(command.menu, key, result);
  }
}

function createRequireCode(entryFiles: Array<EntryFile>): string {
  const code: Array<string> = [];
  for (const entryFile of entryFiles) {
    code.push(
      `'${entryFile.commandId}':require('./${entryFile.src}')['${entryFile.handler}']`
    );
  }
  return `{${code.join(",")}}`;
}

function formatEsbuildErrorMessage(string: string): string {
  return `esbuild error\n${indentString(string, 4)}`;
}
