import { log } from "@create-figma-plugin/common";
import { BuildOptions } from "./types/build.js";
import { buildBundlesAsync } from "./utilities/build-bundles-async/build-bundles-async.js";
import { buildManifestAsync } from "./utilities/build-manifest-async.js";
import { trackElapsedTime } from "./utilities/track-elapsed-time.js";

export async function buildAsync(
  options: BuildOptions & { clearPreviousLine: boolean }
): Promise<void> {
  const { clearPreviousLine, prod, speedMeasure, bundleAnalyzer } = options;
  try {
    log.info("Building...");
    const getBuildElapsedTime = trackElapsedTime();
    await Promise.all([buildBundlesAsync(prod, speedMeasure, bundleAnalyzer), buildManifestAsync(prod)]);
    const buildElapsedTime = getBuildElapsedTime();
    log.success(`Built in ${buildElapsedTime}`, { clearPreviousLine });
  } catch (error: any) {
    log.error(error.message);
    process.exit(1);
  }
}
