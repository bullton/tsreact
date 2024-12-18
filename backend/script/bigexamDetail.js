const axios = require('axios');
const myCheerio = require('cheerio');
const { estateModel } = require('../models');
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
            filter: { ljId },
            update: { $set: setData },
            upsert: true
        }
    });
}

async function getHttp(updateData, url, ljId) {
    console.log('urlWithId', url.concat(ljId));
    const res = await axios({ url: url.concat(ljId), verify: false, method: 'get', headers, timeout: 100000, encoding: null });
    const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
    const locateInfo = JSON.stringify($('div.main-content')[0].children[30].children[0].data);
    eval($('div.main-content')[0].children[30].children[0].data);
    console.log('bandCurve', bandCurve.length);
    const locateInfo2 = $('[data-ng-if="c.band.pcDeg"]')[0].children[0].children[0].data;
    console.log('locateInfo', locateInfo);
    // const now = moment().unix();
    // const date = moment().format('YYYY-MM-DD');
    // const city = locateInfo[0].next.children[0].data.replace('小区', '');
    // const district = locateInfo[0].next.next.next.children[0].data.replace('小区', '');
    // const area = locateInfo[0].next.next.next.next.next.children[0].data.replace('小区', '');
    // const name = locateInfo[0].next.next.next.next.next.next.next.children[0].data;
    // const estateInfo = $("span.xiaoquInfoContent");
    // const buildTime = estateInfo[0].children[0].data;
    // const buildType = estateInfo[1].children[0].data;
    // let propertyFee = parseFloat(estateInfo[2].children[0].data || '0');
    // propertyFee = isNaN(propertyFee) ? 0 : propertyFee;
    // const propertyCompany = estateInfo[3].children[0].data;
    // const developer = estateInfo[4].children[0].data;
    // let totalBuilding = parseInt(estateInfo[5].children[0].data);
    // totalBuilding = isNaN(totalBuilding) ? 0 : totalBuilding;
    // let totalHouse = parseInt(estateInfo[6].children[0].data);
    // totalHouse = isNaN(totalHouse) ? 0 : totalHouse;
    // generateUpdateData(updateData, city, district, area, name, buildTime, buildType, propertyFee, propertyCompany, developer, totalBuilding, totalHouse, ljId)
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


// async function getTotal() {
//     const res = await axios({url: 'https://hz.lianjia.com/xiaoqu/pg1/?from=rec', verify: false, method: 'get', headers, timeout: 10000, encoding: null});
//     const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
//     const totalModule = $("h2.total");
//     const total = parseInt(totalModule[0].children[1].children[0].data.trim());
//     return total;
// }

async function getLjId() {
    const ids = new Set();
    for (let i = 1; i <= 260; i++) {
        // const url = `https://hz.lianjia.com/xiaoqu/pg${i}`
        const url = "https://dse.bigexam.hk/zh-cn/ssp/school/12"
        await sleep(1000);
        console.log('url', url);
        const res = await axios({ url, verify: false, method: 'get', headers, timeout: 100000, encoding: null });
        const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
        const estateInfo = $("li.xiaoquListItem");
        for (let j = 0; j < estateInfo.length; j++) {
            const ljId = estateInfo[j].attribs['data-id'];
            ids.add(ljId)
            console.log('estateInfo', estateInfo[j].attribs['data-id']);
            console.log('estateInfo', estateInfo[j].children[1].children[0].next.attribs['alt']);
        }
    }
    logger.info(`get estate ${ids.size} ids`);
    return Array.from(ids);
}

async function main() {
    try {
        const ids = await getLjId();
        // const ids = ['3']
        const updateData = [];
        let finishRate = 0;
        for (const id of ids) {
            sleep(1000);
            await getHttp(updateData, 'https://dse.bigexam.hk/zh-cn/ssp/school/', id);
            // tempRate = ((ids.indexOf(id) + 1) / ids.length * 100).toFixed(0);
            // if (parseInt(tempRate) > parseInt(finishRate)) {
            //     finishRate = tempRate;
            //     logger.info(`progress: ${finishRate}% Done`);
            // }

        }
        // await estateModel.bulkWrite(updateData);
        logger.info('get estate data successfully');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

