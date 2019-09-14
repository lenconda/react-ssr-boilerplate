import Router from 'koa-router';
import { injectTemplate } from '../utils/template';

const indexRouter = new Router();

indexRouter.get('/', async (ctx, next) => {
  ctx.body = injectTemplate('index.html', 'app__root');
});

export default indexRouter;
