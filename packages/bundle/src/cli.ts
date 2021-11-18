#!/usr/bin/env node
import { log } from "@create-figma-plugin/common";
import sade from "sade";
import { buildAsync } from "./build-async.js";
import { BuildOptions } from "./types/build.js";
import { watchAsync } from "./watch-async/watch-async.js";

sade("build-figma-plugin", true)
  .describe("Build a Figma/FigJam plugin")
  .option("-w, --watch", "Rebuild the plugin on code changes", false)
  .option('-t, --typecheck', 'Type check the plugin code before build', false)
  .option("-prod, --production", "Build the plugin with production mode", false)
  .option("-sm, --speedMeasure", "SpeedMeasurePlugin", false)
  .option("-ba, --bundleAnalyzer", "BundleAnalyzerPlugin", false)
  .action(async function (options: {
    watch: boolean;
    typecheck: boolean
    prod: boolean;
    speedMeasure: boolean;
    bundleAnalyzer: boolean;
  }): Promise<void> {
    const buildOptions: BuildOptions = {
      typecheck: options.typecheck,
      prod: options.prod,
      speedMeasure: options.speedMeasure,
      bundleAnalyzer: options.bundleAnalyzer,
    };

    if (options.watch === true) {
      log.clearViewport();
      await buildAsync({
        ...buildOptions,
        clearPreviousLine: true,
      });
      await watchAsync(buildOptions);
      return;
    }
    await buildAsync({ ...buildOptions, clearPreviousLine: false });
  })
  .parse(process.argv);
