'use strict';

const Router = require('koa-router');
const Koa = require('koa');

const fs = require('fs');
const serve = require('koa-static');

const tpl = require('./lib/templates.js');

const app = new Koa();
const router = new Router();

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
