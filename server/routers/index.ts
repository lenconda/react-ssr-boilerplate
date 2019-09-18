import Router from 'koa-router';

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.render('index.html', 'app__root', {
    title: 'app'
  });
});

router.get('/hello', async (ctx, next) => {
  ctx.render('index.html', 'hello', {
    title: 'hello'
  });
});

router.get('/test', async (ctx, next) => {
  console.log(ctx.state.webpackStats.toJson().assetsByChunkName);
});

export default router;
