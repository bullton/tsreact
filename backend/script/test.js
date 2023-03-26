const axios = require('axios');
const myCheerio = require('cheerio');
const {houseBargainModel} = require('../models/houseModel');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';

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
    // "Accept-Encoding": "gzip, deflate",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    // "Host": "fgj.hangzhou.gov.cn",
    "Referer": "http://fgj.hangzhou.gov.cn/",
    "Upgrade-Insecure-Requests": "1",
    "Cookie": "zh_choose_undefined=s; arialoadData=false; SERVERID=57526053d080975751a9538d16dda0a7|1678115473|1678114551",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

// const houseBargainSchema = new mongoose.Schema({
//     city: {type: String},
//     district: {type: String},
//     bargainType: {type: String},
//     houseType: {type: String},
//     date: {type: Number},
//     square: {type: Number},
//     quantity: {type: Number},
// });

async function getHttp(url) {
    const res = await axios({url, verify: false, method: 'get', headers, timeout: 10000, encoding: null});
    const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
    const ershow = $("#con3");
    const updateData = [];
    const now = moment().unix();
    const date = moment().format('YYYY-MM-DD');
    for (let i=1; i<27;i+=2) {
        const data = {
            city: '杭州',
            district: ershow[0].children[i].children[1].children[0].data,
            bargainType: '二手',
            houseType: '住宅',
            square: ershow[0].children[i].children[9].children[0].data,
            quantity: ershow[0].children[i].children[7].children[0].data,
            dateUnix: now,
            date
        };
        const dataAll2HandBargain = {
            city: '杭州',
            district: ershow[0].children[i].children[1].children[0].data,
            bargainType: '二手',
            houseType: '住商',
            square: ershow[0].children[i].children[5].children[0].data,
            quantity: ershow[0].children[i].children[3].children[0].data,
            dateUnix: now,
            date
        };
        updateData.push(data);
        updateData.push(dataAll2HandBargain);
    }
    logger.info('updateData', JSON.stringify(updateData));
    await houseBargainModel.insertMany(updateData);
}
async function main() {
    try {
        await getHttp('https://zwfw.fgj.hangzhou.gov.cn/hzfcweb_ifs/interaction/scxx');
        logger.info('get hz house bargin data successfully');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

