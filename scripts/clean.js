const fs = require('fs-extra');

function cleanDistProduction() {
  fs.removeSync('dist');
}

cleanDistProduction();
