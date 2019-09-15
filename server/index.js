const path = require('path');
const kcors = require('kcors');
const Koa = require('koa');
const bodyParser = require('body-parser');
const logger = require('koa-logger');
const config = require('./config');
const serve = require('koa-static');
const proxy = require('http-proxy-middleware');
const connect = require('koa2-connect');
const glob = require('glob');
const render = require('./middlewares/render');
const appConfig = require('../config.json');

const router = require('./routers');

const app = new Koa();

app.use(async (ctx, next) => {
  if (ctx.url.startsWith('/api')) {
    ctx.respond = false;
    await connect(proxy({
      target: 'SOME_API_URL',
      changeOrigin: true,
      // pathRewrite: {
      //   '^/api': ''
      // },
      secure: config.isDev ? false : true,
    }))(ctx, next);
  }
  await next();
});

app.use(render(path.join(__dirname, '../templates')));

app.use(router.routes()).use(router.allowedMethods());

glob
  .sync(path.join(__dirname, './routers/**/index.*'), {
    realpath: true,
    absolute: false
  })
  .map((entry, index) => path.dirname(entry))
  .map((entry, index) => path.relative(path.join(__dirname, './routers'), entry))
  .filter((entry, index) => entry !== '')
  .forEach((entry, index) => {
      import('./routers/' + entry)
        .then(route => app.use(route.default.routes()).use(route.default.allowedMethods()));
  });

(config.isProduction && app.use(serve(path.join(__dirname, '../dist/bundle'))));
app.use(serve(path.join(__dirname, (config.isDev ? '../src' : '../dist/static'))));
app.use(kcors());
app.use(bodyParser());
if (config.isDev) app.use(logger());

app.listen(appConfig.port.server);
