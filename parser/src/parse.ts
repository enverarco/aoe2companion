const fs = require('fs');
import * as cheerio from 'cheerio';

// const $ = cheerio.load('<h2 class="title">Hello world</h2>');
// $('h2.title').text('Hello there!');
// $('h2').addClass('welcome');
// $.html();

const template = fs.readFileSync('src/template.html', 'utf-8');
const $ = cheerio.load(template);

const table = $('.wikitable');

console.log("hello");
console.log(table);
