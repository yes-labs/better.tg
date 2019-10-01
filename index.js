'use strict';

const Router = require('koa-router');
const Koa = require('koa');

const fs = require('fs');
const serve = require('koa-static');

const tpl = require('./lib/templates.js');
const blog = require('./lib/blog.js');

const redirects = JSON.parse(fs.readFileSync('./lib/redirects.json'));

const app = new Koa();
const router = new Router();

app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.body = tpl.page("404");
    }
  } catch(e) {
    console.error(e);
  }
})

app.use(async (ctx, next) => {
  if (ctx.request.path in redirects) {
    ctx.redirect(redirects[ctx.request.path]);
  }
  await next();
})

router.get('/', async function(ctx, next) {
  ctx.body = tpl.page('home', {posts: blog.latest});
});

router.get('/latest-news', async function(ctx, next) {
  ctx.body = tpl.page('blog', {posts: blog.posts});
});

router.get('/latest-news/:post', async function(ctx, next) {
  let post = blog.posts.find(o => o.slug === ctx.params.post);
  if (post) {
    ctx.body = tpl.page('blog-post', post);
  }
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
