module.exports = function (buildOptions) {
  return {
    ...buildOptions,
    define: {
      global: "window",
    },
    loader: { ".glb": "dataurl" },
  };
};
