const axios = require('axios');
const myCheerio = require('cheerio');
const {estateModel} = require('../models');
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

function generateUpdateData(updateData, city, district, area, name, buildTime, buildType, propertyFee, propertyCompany, developer, totalBuilding, totalHouse, ljId) {
    const setData = {
        city, district, area, name, buildTime, buildType, propertyFee, propertyCompany, developer, totalBuilding, totalHouse
    };
    updateData.push({
        updateOne: {
            filter: {ljId},
            update: {$set: setData},
            upsert: true
        }
    });
}

async function getHttp(url, ljId) {
    const res = await axios({url: url.concat(ljId), verify: false, method: 'get', headers, timeout: 10000, encoding: null});
    const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
    const locateInfo = $("span.stp");
    const updateData = [];
    const now = moment().unix();
    const date = moment().format('YYYY-MM-DD');
    console.log('estate', locateInfo[0].next.children[0].data);
    const city = locateInfo[0].next.children[0].data.replace('小区', '');
    const district = locateInfo[0].next.next.next.children[0].data.replace('小区', '');
    const area = locateInfo[0].next.next.next.next.next.children[0].data.replace('小区', '');
    const name = locateInfo[0].next.next.next.next.next.next.next.children[0].data;
    console.log('name', name);
    const estateInfo = $("span.xiaoquInfoContent");
    const buildTime = estateInfo[0].children[0].data;
    const buildType = estateInfo[1].children[0].data;
    const propertyFee = parseFloat(estateInfo[2].children[0].data);
    const propertyCompany = estateInfo[3].children[0].data;
    const developer = estateInfo[4].children[0].data;
    const totalBuilding = parseInt(estateInfo[5].children[0].data);
    const totalHouse = parseInt(estateInfo[6].children[0].data);
    console.log('estateInfo', estateInfo[0]);
    generateUpdateData(updateData, city, district, area, name, buildTime, buildType, propertyFee, propertyCompany, developer, totalBuilding, totalHouse, ljId)
    logger.info('updateData', JSON.stringify(updateData));
    await estateModel.bulkWrite(updateData);
}
async function main() {
    try {
        await getHttp('https://hz.lianjia.com/xiaoqu/', '1820028756283646');
        await getHttp('https://hz.lianjia.com/xiaoqu/', '1811099758334');
        await getHttp('https://hz.lianjia.com/xiaoqu/', '1820025411844714');
        await getHttp('https://hz.lianjia.com/xiaoqu/', '1820028076472676');
        await getHttp('https://hz.lianjia.com/xiaoqu/', '188396620705655');
        // await getHttp('https://bj.lianjia.com/ershoufang/', '北京', '链家');
        // await getHttp('https://cd.lianjia.com/ershoufang/', '成都', '链家');
        // await getHttp('https://nj.lianjia.com/ershoufang/', '南京', '链家');
        // await getHttp('https://cq.lianjia.com/ershoufang/', '重庆', '链家');
        // await getHttp('https://sy.lianjia.com/ershoufang/', '沈阳', '链家');
        logger.info('get estate data successfully');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

