import cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';
import serverConfig from '../../../config/server.config';
import { Context } from 'koa';

export const injectTemplate = (content: string, entry: string, context: Context) => {
  const $ = cheerio.load(content);
  const manifest = serverConfig.isDev
    ? context.state.webpackStats.toJson()
    : JSON.parse(fs.readFileSync(
      path.join(__dirname, '../../dist/manifest.json'),
      { encoding: 'utf8' }
    ) || '{}');

  if (manifest.entrypoints[entry]) {
    const assets = manifest.entrypoints[entry].assets;
    assets.forEach((value: string) => {
      if (value.endsWith('js')) {
        const element = cheerio.load('<script></script>');
        element('script')
          .attr('src', manifest.publicPath + value)
          .attr('type', 'text/javascript');
        $('body').append(element.html());
      } else {
        const element = cheerio.load('<link></link>');
        element('link')
          .attr('href', manifest.publicPath + value)
          .attr('rel', 'stylesheet');
        $('head').append(element.html());
      }
    });
  }

  return $.html();
};
