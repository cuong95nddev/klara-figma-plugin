import { constants, log } from "@create-figma-plugin/common";
import { watch } from "chokidar";
import { yellow } from "kleur/colors";
import { BuildOptions } from "../types/build.js";
import { buildBundlesAsync } from "../utilities/build-bundles-async/build-bundles-async.js";
import { buildManifestAsync } from "../utilities/build-manifest-async.js";
import { trackElapsedTime } from "../utilities/track-elapsed-time.js";
import { watchIgnoreRegex } from "./watch-ignore-regex.js";

const packageJsonRegex = /^package\.json$/;

export async function watchAsync(options: BuildOptions): Promise<void> {
  const { prod } = options;
  let endTypeCheckWatch: () => void;
  const watcher = watch(
    [
      "**/*.{css,js,json,jsx,ts,tsx}",
      constants.build.mainConfigFilePath,
      constants.build.manifestConfigFilePath,
      constants.build.uiConfigFilePath,
      "package.json",
      "tsconfig.json",
    ],
    {
      ignored: function (path: string): boolean {
        return watchIgnoreRegex.test(path) === true;
      },
    }
  );
  watcher.on("ready", function (): void {
    log.info("Watching...");
  });
  watcher.on("change", async function (file: string): Promise<void> {
    try {
      log.clearViewport();
      const getElapsedTime = trackElapsedTime();
      log.info(`Changed ${yellow(file)}`);
      const promises: Array<Promise<void>> = [];
      if (packageJsonRegex.test(file) === true) {
        promises.push(buildManifestAsync(prod));
      }
      promises.push(buildBundlesAsync(false, false, false));
      await Promise.all(promises);
      log.success(`Built in ${getElapsedTime()}`);
      log.info("Watching...");
    } catch (error: any) {
      log.error(error.message);
    }
  });
}
