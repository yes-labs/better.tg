'use strict';

// A super hacky made up templating / framework thing
// because I spent a night trying to figure out the simple
// ones with koa and gave up.

const fs = require('fs').promises;
const glob = require('glob-promise');
const handlebars = require('handlebars');
const hmoment = require('handlebars.moment');

hmoment.registerHelpers(handlebars);
// Just keep all the template data in memory, there arent many.
let templates = {};

async function run() {
  let files = await glob(__dirname + '/../views/**/*');
  for (let file of files) {
    let stat = await fs.lstat(file);
    if (!stat.isFile()) {
      continue;
    }
    let name = file.substring(file.indexOf("/views/") + 7);
    name = name.substring(0, name.length - 4);

    let index = name.indexOf("/");
    let type = name.slice(0, index);
    let path = name.slice(index + 1)
    let content = await fs.readFile(file, 'utf8');
    if (!(type in templates)) {
      templates[type] = {};
    }
    if (type === "partials") {
      handlebars.registerPartial(path, content);
    } else {
      templates[type][path] = handlebars.compile(content);
    }
  }
};

run();

exports.page = function(name, opts = {}) {
  if (!(name in templates.pages)) {
    return false;
  }
  let page = templates.pages[name](opts);
  return templates.layouts.default({
    body: page
  })
}
