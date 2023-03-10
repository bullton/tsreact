const axios = require('axios');
const {houseBargainModel} = require('../models/houseModel');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';

const headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
}

async function getHttp(url) {
    const res = await axios({url, verify: false, method: 'get', headers, timeout: 10000});
    const updateData = res.data.map((item) => {
        const update = {
            "city" : "深圳",
            "district" : item.ZONE,
            "bargainType" : "二手",
            "houseType" : item.HOUSE_USAGE2,
            "date" : item.TJ_DATE,
            "dateUnix" : moment(new Date(item.TJ_DATE)).unix(),
            "square" : `${item.CJ_AREA}m²`,
            "quantity" : `${item.CJ_NUM}套`
        };
        const filter = {"city" : "深圳", "district" : item.ZONE, "houseType" : item.HOUSE_USAGE2, "date" : item.TJ_DATE};
        return {updateOne: {filter, update, upsert: true}};
    });
    logger.info('updateData', JSON.stringify(updateData));
    await houseBargainModel.bulkWrite(updateData);
}
async function main() {
    try {
        await getHttp('https://opendata.sz.gov.cn/data/dataSet/getPreviewData?tableName=zjj_esfcjxxartj&resId=29200%2F01903513&_=1678464754359');
        logger.info('get sz house bargin data successfully');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

