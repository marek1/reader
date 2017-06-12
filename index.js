var prodFolder = '';
var url = 'http://www.manager-magazin.de';
var writeFile = 'reader.html';
var filesWritten = 0;
var noOfTitles = 10;

var articleCounter = 0;
var articlesParsedCounter = 0;
// creating a dict, which looks like this:
// { article_X: { urls: ['href1', 'href2'], text: '' }, ...}
var finalObject = {};

//DI
var http = require('http');
var cheerio = require('cheerio');
var fs = require('fs');
var iconv  = require('iconv-lite');
var encoding = require("encoding");

var filterHtml = function(_rawHtml, i) {

    // console.log('filterHtml : ', _rawHtml.toString().substr(0,10), ' , i : ', i)

	// var filteredHtml = iconv.decode(_rawHtml, 'utf8');
    var $ = cheerio.load(_rawHtml);

    var pageContent = $('.article-section');

    // if it has more parts

    var otherParts = $('.part');
    // console.log('otherParts : ', otherParts);
    for (var j = 0; j < otherParts.length; j++) {
        // increase articleCounter
        if (otherParts[j].type === 'tag') {
			var _partUrl = otherParts[j].attribs.href;
			if (_partUrl.indexOf('http') < 0 ) {
				_partUrl = url + _partUrl;
			}
			if (finalObject['article_'+i]['urls'].indexOf(_partUrl) < 0) {
				articleCounter++;
				console.log(j, ' otherParts ', _partUrl);
				finalObject['article_'+i].urls.push(_partUrl);
				getUrl(_partUrl, filterHtml, i);
            }
		}
    }

    // console.log('pageContent : ',pageContent.toString().substr(0,10));

	/**
	 * remove
	 *  - div
	 *  - script
	 *  - noscript
	 */

	$(pageContent).find('div').remove();
	$(pageContent).find('script').remove();
	$(pageContent).find('noscript').remove();

    writeToFinalObject(pageContent, i);

	articlesParsedCounter++;

    // Question : When to write to file?
    // Answer : When articleCounter =
    // console.log('articlesParsedCounter : ', articlesParsedCounter , ' articleCounter ', articleCounter);
    if (articlesParsedCounter === articleCounter) {
        writeToFile();
    }
};

var writeToFinalObject = function(pageContent, i) {
    // console.log('writing to article ', i , ' ... ', pageContent.toString().substr(0,10) +  '...');
    finalObject['article_'+i]['text']+=pageContent;
    // console.log(i, ' : ', finalObject['article_'+i]);
};

var writeFirstLines = function(){

    var _scaffold = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"><title>Reader</title></head><body>';

    var _googleDrive = ''; //'<script src="https://apis.google.com/js/platform.js" async defer></script><div class="g-savetodrive" data-src="reader.pdf" data-filename="reader.pdf" data-sitename="MMReader"></div>';

    fs.writeFile(prodFolder + writeFile, _scaffold + _googleDrive, function(){console.log('done')});
};

var clearFile = function () {
    fs.exists(prodFolder + writeFile, function (exists) {
        if (exists) {
            fs.unlink(prodFolder + writeFile, function () {
                writeFirstLines();
            });
        }
    });

};

var writeToFile = function(){
    /**
     * write to file
     */
    var allContent;
    for (var article in finalObject) {
		if (finalObject.hasOwnProperty(article)) {
			allContent += finalObject[article]['text'];
		}
    }
    fs.appendFile(prodFolder + writeFile, allContent, function(err) {
        if(err) {
            return console.log(err);
        }
        filesWritten++;
        if (filesWritten === noOfTitles){
            closeFile();
        }
        // console.log("The file was saved!");
    });

};

var closeFile = function() {
    fs.appendFile(prodFolder + writeFile, '</body>', function(err) {
        if(err) {
            return console.log(err);
        }

        // console.log("The file was saved!");
    });
};

var getArticle = function(_url, i){
    console.log('_url : ', _url ,' i : ', i);
    /**
     * get article
     */
    if (_url.indexOf('fotostrecke') < 0) {
        // increase articleCounter
        articleCounter++;
        // initialise object
        finalObject['article_'+i] = {
            urls: [],
            text: ''
        };
        finalObject['article_'+i].urls.push(url+_url);
        // console.log('finalObject: ', finalObject);
        getUrl(url+_url, filterHtml, i);
    }
};

var getTitles = function(_html) {

    /**
     * get titles from index
     */

	// console.log('_html : ',_html);

    var $ = cheerio.load(_html);

    var hrefArray = $('.article-title a');

    // console.log('....',hrefArray);

	if (hrefArray.length<1){
		return false;
	}

    for (var i = 0; i < noOfTitles; i++) {

        console.log(i,' get href ', hrefArray[i].attribs.href);

        getArticle(hrefArray[i].attribs.href, i);

    }

};

var replaceUmlaute = function(_text) {

    var text = _text.toString();
    text = text.replace(/ö/g,'oe');
    text = text.replace(/Ö/g,'Oe');
    text = text.replace(/Ü/g,'ue');
    text = text.replace(/ü/g,'ue');
    text = text.replace(/ä/g,'ae');
    text = text.replace(/Ä/g,'Ae');
    text = text.replace(/ß/g,'ss');

    return text;
};

var getUrl = function(_url, callback, i) {
    console.log(_url, ' : ', i);
    /**
     * request url
     */
    // Configure the request
	var options = {
		url: _url,
		method: 'GET'
	};
	http.get(_url, function(res){
		console.log('request');
		var finalStr='';
		res.on('data', function(chunk){
			// console.log('chunk!');
			finalStr += replaceUmlaute(iconv.decode(chunk, 'utf-8'));// 'iso-8859-1'));
			// callback(_body);
			// writeToFile(iconv.decode(chunk, 'iso-8859-1'));
		});
		res.on('end', function(){
			console.log('loaded!');
			var _body = replaceUmlaute(iconv.decode(finalStr, 'utf-8')); //'iso-8859-1'));
            if (typeof i !== 'undefined') {
    			callback(_body, i);
            } else {
                callback(_body);
            }
		});

	});
};

//init
clearFile();
// print process.argv
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if (index===2 && val) {
        prodFolder = val; //i.e. /var/www/vhosts/marek-sonnabend.de/httpdocs/reader/
    }
    if (index===3 && val) {
        noOfTitles = val; //i.e. 15
    }
});
getUrl(url, getTitles);
