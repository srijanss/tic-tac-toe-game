module.exports = {
  plugins: [
    require("stylelint")({
      configFile: "./.stylelintrc.json",
    }),
    require("autoprefixer")({
      overrideBrowserslist: ["last 2 versions", "ie > 8"],
    }),
    require("postcss-preset-env")({
      stage: 1,
    }),
    require("postcss-import"),
    require("postcss-nested"),
    require("postcss-mixins"),
    require("cssnano")({
      preset: "default",
    }),
  ],
};
