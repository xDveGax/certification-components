const fs = require('fs-extra');
const concat = require('concat');

(async function build() {

  const files =[
    './dist/certification-components/runtime.js',
    './dist/certification-components/polyfills.js',
    './dist/certification-components/main.js'
  ];

  await fs.ensureDir('certification-components');
  await concat(files, 'certification-components/exo-custom-element.js');
  await fs.copyFile('./dist/certification-components/styles.css', 'certification-components/styles.css');
  console.info('Web component created successfully!');

})();
