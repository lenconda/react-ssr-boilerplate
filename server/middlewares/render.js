const path = require('path');
const { injectTemplate } = require('../utils/template');
const handlebars = require('handlebars');
const fs = require('fs-extra');

exports = module.exports = templateBasePath => {
  return (ctx, next) => {
    if (ctx.render) return next();

    ctx.response.render = ctx.render = (file, entry, options = {}) => {
      ctx.type = 'text/html';
      const raw = fs.readFileSync(path.join(templateBasePath, file), { encoding: 'utf8' });
      const source = injectTemplate(raw, entry);
      const compiled = handlebars.compile(source);
      const html = compiled(options);
      ctx.body = html;
    };

    return next();
  };
};
