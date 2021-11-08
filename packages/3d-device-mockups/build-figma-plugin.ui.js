module.exports = function (buildOptions) {
  let loader = { ...buildOptions.loader, ".glb": "dataurl" };
  let plugins = buildOptions.plugins.filter(
    (plugin) => plugin.name != "preact-compat"
  );

  return {
    ...buildOptions,
    define: {
      global: "window",
    },
    jsxFactory: undefined,
    jsxFragment: undefined,
    plugins: plugins,
    loader: loader,
  };
};
