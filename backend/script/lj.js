const axios = require('axios');
const myCheerio = require('cheerio');
const {houseListingsModel} = require('../models');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';

const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    // "Accept-Encoding": "gzip, deflate",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    // "Host": "fgj.hangzhou.gov.cn",
    // "Referer": "http://fgj.hangzhou.gov.cn/",
    "Upgrade-Insecure-Requests": "1",
    "Cookie": "zh_choose_undefined=s; arialoadData=false; SERVERID=57526053d080975751a9538d16dda0a7|1678115473|1678114551",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

function generateUpdateData(updateData, httpModule, now, date, source, listingsType, houseType, city) {
    const setData = {
        quantity: parseInt(httpModule[0].children[1].children[0].data.trim()),
        dateUnix: now
    };
    updateData.push({
        updateOne: {
            filter: {city, date, listingsType, houseType, source},
            update: {$set: setData},
            upsert: true
        }
    });
}

async function getHttp(url, city, source) {
    const res = await axios({url, verify: false, method: 'get', headers, timeout: 10000, encoding: null});
    const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
    const ershow = $("h2.total");
    const updateData = [];
    const now = moment().unix();
    const date = moment().format('YYYY-MM-DD');
    generateUpdateData(updateData, ershow, now, date, source, '二手', '住商', city)
    logger.info('updateData', JSON.stringify(updateData));
    await houseListingsModel.bulkWrite(updateData);
}
async function main() {
    try {
        await getHttp('https://hz.lianjia.com/ershoufang/', '杭州', '链家');
        await getHttp('https://bj.lianjia.com/ershoufang/', '北京', '链家');
        await getHttp('https://cd.lianjia.com/ershoufang/', '成都', '链家');
        await getHttp('https://nj.lianjia.com/ershoufang/', '南京', '链家');
        await getHttp('https://cq.lianjia.com/ershoufang/', '重庆', '链家');
        await getHttp('https://sy.lianjia.com/ershoufang/', '沈阳', '链家');
        logger.info('get house listings data successfully');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

