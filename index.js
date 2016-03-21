var url = 'http://www.manager-magazin.de/';
var writeFile = 'index.html';
var filesWritten = 0;
var noOfTitles = 2;

var finalText = '';
//DI
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var iconv  = require('iconv-lite');
var encoding = require("encoding");

var filterHtml = function(_rawHtml){

    //console.log('_rawHtml : ',_rawHtml);

    var $ = cheerio.load(_rawHtml);

    var pageContent = $('.article-section');

    //console.log('div ? ',$(pageContent).find('div'));
    /**
     * remove
     *  - div
     *  - script
     *  - noscript
     */

    $(pageContent).find('div').remove();
    $(pageContent).find('script').remove();
    $(pageContent).find('noscript').remove();


    //console.log('pageContent : ',pageContent);
    writeToFile(pageContent);



};

var clearFile = function(){

    var _scaffold = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"><title>Reader</title></head><body>';

    fs.writeFile(writeFile, _scaffold, function(){console.log('done')})

};

var writeToFile = function(_content){
    /**
     * write to file
     */
    //console.log('_content : ',_content);
    fs.appendFile(writeFile, _content, function(err) {
        if(err) {
            return console.log(err);
        }
        filesWritten++;
        if (filesWritten === noOfTitles){
            closeFile();
        }
        console.log("The file was saved!");
    });

};

var closeFile = function() {
    fs.appendFile(writeFile, '</body>', function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
};

var getArticle = function(_url){

    /**
     * get article
     */

    console.log('_url : ',_url);

    if (_url.indexOf('fotostrecke') < 0){
        getUrl(url+_url, filterHtml);
    }

};

var getTitles = function(_html) {

    /**
     * get titles from index
     */

    var $ = cheerio.load(_html);

    var hrefArray = $('.article-title a');

    //console.log('....',hrefArray.length);

    for (var i = 0; i < noOfTitles; i++) {

        //console.log('... ', hrefArray[i].attribs.href);

        var a = hrefArray[i].attribs.href;

        getArticle(hrefArray[i].attribs.href);


    }


};

var replaceUmlate = function(_text) {

    var text = _text.toString();
    console.log('_text : ',_text.indexOf('ü'));
    text = text.replace(/ö/g,'oe');
    text = text.replace(/Ö/g,'Oe');
    text = text.replace(/ü/g,'ue');
    text = text.replace(/Ü/g,'ue');
    text = text.replace(/ä/g,'ae');
    text = text.replace(/Ä/g,'Ae');
    text = text.replace(/ß/g,'ss');

    return text;
};

var getUrl = function(_url, callback) {


    /**
     * request url
     */
    var requestOptions  = { encoding: 'utf8', method: "GET", uri: _url};

    request.get(requestOptions, function (error, response, body) {
        //console.log('body ; ',body);
        if (!error && response.statusCode == 200) {
            // replace umlaute
            callback(body);
        }
    });

};

//init
//clearFile();
//getUrl(url, getTitles);
var result = encoding.convert("ÕÄÖÜ", "utf8");
console.log(result); //<Buffer d5 c4 d6 dc>
var str = iconv.decode(result, 'utf8');
console.log('str ',str);