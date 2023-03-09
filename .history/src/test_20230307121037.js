const axios = require('axios');
// const request = require('request');
const myCheerio = require('cheerio');
// const myIconv = require('iconv-lite');
const myEncoding = null;


var seedURL_format = "$('a')";
var keywords_format = " $('meta[name=\"keywords\"]').eq(0).attr(\"content\")";
var title_format = "$('title').text()";
var date_format = "$('#pubtime_baidu').text()";
var author_format = "$('#editor_baidu').text()";
var content_format = "$('.left_zw').text()";
var desc_format = " $('meta[name=\"description\"]').eq(0).attr(\"content\")";
var source_format = "$('#source_baidu').text()";
var url_reg = /\/(\d{4})\/(\d{2})-(\d{2})\/(\d{7}).shtml/;

const chengjiao_format = '$(".box3")'
const ershow_format = '$("#con3")'

const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Accept-Encoding": "gzip, deflate",
    // "Cache-Control": "max-age=0",
    // "Connection": "keep-alive",
    // "Host": "fgj.hangzhou.gov.cn",
    // "Referer": "http://fgj.hangzhou.gov.cn/",
    // "Upgrade-Insecure-Requests": "1",
    // "Cookie": "zh_choose_undefined=s; arialoadData=false; SERVERID=57526053d080975751a9538d16dda0a7|1678115473|1678114551",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

const cookies = {
    "zh_choose_undefined": "s",
    "arialoadData": "false",
    "SERVERID": "57526053d080975751a9538d16dda0a7|1678115473|1678114551"
}

// async function reqqqq(url) {
//     const options = {
//         url: url,
//         encoding: null,
//         headers: headers,
//         timeout: 10000 
//     }
//     return await request(options);
// }

async function getHttp(url) {
    try {
        const res = await axios({url, method: 'get', headers, timeout: 10000});
        // const res2 = await reqqqq(url);
        // var html = myIconv.decode(res.data, myEncoding);
        const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
        console.log(res.data); 
        const ershow = $("#con3");
        // console.log(chengjiao_box.length, seedurl_news[0].children[0].next.children[0].data);
        // console.log(chengjiao_box.length, chengjiao_box[1].children[1].);
        console.log('今日二手房累计成交信息');
        console.log(ershow.length, ershow[0].children[1].children[1].children[0].data); //name
        console.log(ershow.length, ershow[0].children[1].children[3].children[0].data); //总套数
        console.log(ershow.length, ershow[0].children[1].children[5].children[0].data); //总面积
        console.log(ershow.length, ershow[0].children[1].children[7].children[0].data); //住宅套数
        console.log(ershow.length, ershow[0].children[1].children[9].children[0].data); //住宅面积
        
        console.log(ershow.length, ershow[0].children[1].children[1].children[0].data); //name
        console.log(ershow.length, ershow[0].children[3].children[3].children[0].data); //总套数
        console.log(ershow.length, ershow[0].children[5].children[5].children[0].data); //总面积
        console.log(ershow.length, ershow[0].children[7].children[7].children[0].data); //住宅套数
        console.log(ershow.length, ershow[0].children[9].children[9].children[0].data); //住宅面积
    } catch(e) {
        console.log(e);
    }
    
}


// getHttp('https://zwfw.fgj.hangzhou.gov.cn/hzfcweb_ifs/interaction/scxx');
getHttp('https://zwfw.fgj.hangzhou.gov.cn/hzfcweb_ifs/interaction/scxx');
