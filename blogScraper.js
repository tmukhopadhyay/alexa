var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var urls = [
	'https://www.blackrockblog.com/category/investing-2/',
	'https://www.blackrockblog.com/category/markets-2/',
	'https://www.blackrockblog.com/category/economy/',
	'https://www.blackrockblog.com/category/retirement/',
	'https://www.blackrockblog.com/category/exchange-traded-funds-2/'
];

for(var index in urls) {
	var url = urls[index];

	request(url, (function(){
		return function(error, response, html){
			if(error) throw error;

			var $ = cheerio.load(html);
			$('.article-title').filter(function(){
				var _self = $(this);

				request(_self.attr('href'), (function(){
					return function(err, resp, body){
						if(err) throw err;

						var S = cheerio.load(body);
						console.log(S('h1').text());
						fs.appendFileSync('data.json', '{\n"title": "' + S('h1').text() + '",\n');
						fs.appendFileSync('data.json', '"content": "' + S('.article-subtitle').text() + '"\n},');
					}
				})());
			});
		}
	}()));
}