import Router from 'koa-router';

const indexRouter = new Router();

indexRouter.get('/', async (ctx, next) => {
  ctx.render('index.html', 'app__root', {
    title: 'fuck'
  });
});

export default indexRouter;
