const axios = require('axios');
const { estateModel, estateBargainModel } = require('../models');
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

function generateUpdateData(updateData, ljId, name, sellNum, day90Sold, day30See, district, area, date, dateUnix) {
    const setData = {
        name, sellNum, day90Sold, day30See, district, area, date, dateUnix
    };
    updateData.push({
        updateOne: {
            filter: { ljId, date },
            update: { $set: setData },
            upsert: true
        }
    });
}

async function getHttp(updateData, url, ljId) {
    const res = await axios({ url, method: 'get', headers, timeout: 10000 });
    const now = moment().unix();
    const date = moment().format('YYYY-MM-DD');
    const { name, districtName: district, bizcircleName: area, '90saleCount': day90Sold, day30See, sellNum } = res.data.data.info;
    generateUpdateData(updateData, ljId, name, sellNum, day90Sold, day30See, district, area, date, now)
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function getLjId() {
    const ids = await estateModel.distinct('ljId', {});
    return ids;

}

async function main() {
    try {
        const ids = await getLjId();
        // const ids = ['1820028756283646']
        const updateData = [];
        let finishRate = 0;
        for (const id of ids) {
            sleep(1000);
            await getHttp(updateData, `https://hz.lianjia.com/api/listtop?semParams%5BsemResblockId%5D=${id}`, id);
            tempRate = ((ids.indexOf(id) + 1) / ids.length * 100).toFixed(0);
            if (parseInt(tempRate) > parseInt(finishRate)) {
                finishRate = tempRate;
                logger.info(`progress: ${finishRate}% Done`);
            }

        }
        await estateBargainModel.bulkWrite(updateData);
        logger.info('get estate bargain data successfully');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

