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
  ctx.body = ctx.state.webpackStats.toJson();
});

export default router;
