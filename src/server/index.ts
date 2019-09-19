import path from 'path';
import kcors from 'kcors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';
import proxy from 'http-proxy-middleware';
import connect from 'koa2-connect';
import glob from 'glob';
import render from './middlewares/render';
import webpack from 'webpack';
import koaWebpack from 'koa-webpack';
import webpackConfig from '../../config/webpack.config';
import portsConfig from '../../config/ports.config';
import serverConfig from '../../config/server.config';

const fixedWebpack: any = webpack;
const compiler = fixedWebpack(webpackConfig);

const bootstrap = {
  prod: async () => {
    const app = new Koa();

    app.use(serve(path.join(__dirname, '../../dist')));

    return app;
  },

  dev: async () => {
    const app = new Koa();
    const webpackMiddleware = await koaWebpack({
      compiler,
      devMiddleware: {
        serverSideRender: true,
        publicPath: '/'
      }
    });

    app.use(webpackMiddleware);

    app.use(serve(path.join(__dirname, '../client')));
    app.use(logger());

    return app;
  }
};

const start = serverConfig.isDev ? bootstrap.dev : bootstrap.prod;

start()
  .then(app => {
    app.use(async (ctx, next) => {
      if (ctx.url.startsWith('/api')) {
        ctx.respond = false;
        await connect(proxy({
          target: 'SOME_API_URL',
          changeOrigin: true,
          // pathRewrite: {
          //   '^/api': ''
          // },
        }))(ctx, next);
      }

      await next();
    });

    app.use(render(path.join(__dirname, '../templates')));
    app.use(kcors());
    app.use(bodyParser());

    glob
      .sync(path.join(__dirname, 'routes/**/index.{ts,tsx}}'), {
        realpath: true,
        absolute: false
      })
      .map((entry, index) => path.dirname(entry))
      .map((entry, index) => path.relative(path.join(__dirname, './routes'), entry))
      .filter((entry, index) => entry !== '')
      .forEach((entry, index) => {
      import('./routes/' + entry)
        .then(route => app.use(route.default.routes()).use(route.default.allowedMethods()));
      });

    return app;
  })
  .then(app => app.listen(portsConfig.port.server))
  .catch(err => console.log(err));
