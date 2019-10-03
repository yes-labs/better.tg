'use strict';

const fs = require('fs').promises;
const glob = require('glob-promise');
const markdown = require('markdown').markdown;
const yamlFront = require('yaml-front-matter');

let blogs = [];

async function run() {
  let files = await glob(__dirname + '/../blog/*.md');
  for (let file of files) {
    let content = await fs.readFile(file, 'utf8');
    let yaml = yamlFront.loadFront(content);
    yaml.slug = file.split('/').reverse()[0].slice(0, -3);
    yaml.html = markdown.toHTML(yaml.__content);
    let index = yaml.html.indexOf('</p>');
    yaml.preview = yaml.html.slice(0, index);
    yaml.date = Date.parse(yaml.date)
    blogs.push(yaml);
  }

  blogs.sort((a, b) => b.date - a.date);

  exports.latest = blogs.slice(0, 5);
  exports.posts = blogs;
}

run();
