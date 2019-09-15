const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const config = require('../../config.json');

const injectTemplate = (content, entry) => {
  const prefix = process.env.NODE_ENV === 'production' ? '' : `http://localhost:${config.port.bundle}`;

  // const rawTemplate = fs.readFileSync(path.join(process.cwd(), 'templates', content));
  const $ = cheerio.load(content);

  if (process.env.NODE_ENV === 'production') {
    const manifestPath = path.join(__dirname, '../../dist/manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, { encoding: 'utf8' }) || '{}');

    if (manifest[entry]) {
      if (manifest[entry]['css']) {
        $('head').append(`<link rel="stylesheet" href="${prefix}${manifest[entry]['css']}"></link>`);
      }

      if (manifest[entry]['js']) {
        $('body').append(`<script type="text/javascript" src="${prefix}${manifest[entry]['js']}"></script>`);
      }
    }

    if (manifest['app__common']) {
      if (manifest['app__common']['css']) {
        $('head').append(`<link rel="stylesheet" href="${prefix}${manifest['app__common']['css']}"></link>`);
      }

      if (manifest['app__common']['js']) {
        $('body').append(`<script type="text/javascript" src="${prefix}${manifest['app__common']['js']}"></script>`);
      }
    }
  } else {
    $('head').append(`<link rel="stylesheet" href="${prefix}/static/css/${entry}.css"></link>`);
    $('body').append(`<script type="text/javascript" src="${prefix}/static/js/${entry}-routes.js"></script>`);
    $('head').append(`<link rel="stylesheet" href="${prefix}/static/css/app__common.css"></link>`);
    $('body').append(`<script type="text/javascript" src="${prefix}/static/js/app__common.chunk.js"></script>`);
  }

  return $.html();
};

exports = module.exports = { injectTemplate };
