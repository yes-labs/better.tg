'use strict';

const Router = require('koa-router');
const Koa = require('koa');

const fs = require('fs');
const serve = require('koa-static');

const tpl = require('./lib/templates.js');

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.body = tpl.page("404");
    }
  } catch(e) { }
})

router.get('/', async function(ctx, next) {
  ctx.body = tpl.page('home');
});

router.get('/*', async function(ctx, next) {
  let path = ctx.request.path.replace(/^\/+|\/+$/g, '');
  let content = tpl.page(path);
  if (content) {
    ctx.body = content;
  } else {
    await next();
  }
});

app
  .use(router.routes())
  .use(serve(__dirname + '/www/', {extensions: true}));

app.listen(process.env.PORT || 3000);
