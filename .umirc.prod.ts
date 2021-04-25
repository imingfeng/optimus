process.env.HOST_ENV='prod'
const { version } = require('./package.json');
export default {
  outputPath: `./dist/${version}/`,
}