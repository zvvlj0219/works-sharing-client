const path = require('path')

module.exports = {
  "stories": [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    // '../stories/*.stories.@(js|jsx|ts|tsx)'
  ],
  "staticDirs": ["../public"],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-next-router"
  ],
  // setup for sass
  webpackFinal: async (config) => {

    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: {
              auto: true,
            },
          },
        },
        'sass-loader',
      ],
      include: path.resolve(__dirname, '../'),
    })
    return config
  },
  "framework": "@storybook/react",
  "core": {
    "builder": "@storybook/builder-webpack5"
  }
}