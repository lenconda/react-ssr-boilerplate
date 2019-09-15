const Router = require('koa-router');

const router = new Router();

router.get('/', async (ctx, next) => {
  ctx.render('index.html', 'app__root', {
    title: 'app'
  });
});

router.get('/hello', async (ctx, next) => {
  // ctx.render('index.html', 'hello', {
  //   title: 'hello'
  // });
  ctx.body = {
    title: 'fuck you'
  };
});

exports = module.exports = router;
