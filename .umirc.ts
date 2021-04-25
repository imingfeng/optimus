import { IConfig } from 'umi-types';
import { resolve } from 'path'

// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  hash: true,
  alias: {
    config: resolve(__dirname, './src/config'),
    utils: resolve(__dirname, './src/utils'),
    themes: resolve(__dirname, './src/themes'),
    services: resolve(__dirname, './src/services'),
    components: resolve(__dirname, './src/components'),
    assets: resolve(__dirname, './src/assets'),
  },
  targets: {
    ie: 11,
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'umits',
      dll: true,
      locale: {
        enable: true,
        default: 'en-US',
      },
      routes: {
        exclude: [
          /model\.(j|t)sx?$/,
          /service\.(j|t)sx?$/,
          /config\//,
          /models\//,
          /components\//,
          /services\//,
        ],
      },
    }],
  ],
  chainWebpack(config, { webpack }) {
    config
      .plugin('env')
      .use(require.resolve('webpack/lib/DefinePlugin'), [{ HOST_ENV: JSON.stringify(process.env.HOST_ENV), }]);
  },
  theme: "./theme.config.ts",
}

export default config;
