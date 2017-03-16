/* eslint-disable no-console */

const fs = require('fs');
const fsp = require('fs-promise');

const CHROME_VERSION = '57.0.2987.98';
const WIDEVINECDM_VERSION = process.env.npm_package_version;

console.log(`Platform: ${process.platform}`);

// https://github.com/electron/electron/blob/master/docs/tutorial/using-pepper-flash-plugin.md
if (process.platform === 'darwin') {
  const pluginPath = `/Applications/Google Chrome.app/Contents/Versions/${CHROME_VERSION}/Google Chrome Framework.framework/Libraries/WidevineCdm`;
  if (fs.existsSync(pluginPath)) {
    console.log('Plugin exists.');
    fsp.readFile(`${pluginPath}/manifest.json`)
      .then((manifestJSON) => {
        const info = JSON.parse(manifestJSON);
        if (info.version !== WIDEVINECDM_VERSION) {
          console.log(`npm version: ${WIDEVINECDM_VERSION}`);
          console.log(`Manifest version: ${info.version}`);
          return Promise.reject(new Error('Manifest version doesn\'t match.'));
        }
        return null;
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  } else {
    process.exit(1);
    console.log('Plugin does not exist.');
  }
}