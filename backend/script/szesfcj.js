const axios = require('axios');
// const { houseBargainModel } = require('../models/houseModel');
const { houseBargainModel } = require('../models');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';

// const headers = {
//     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
//     "Accept-Language": "zh-CN,zh;q=0.9",
//     "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
// }


const headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": 'zh-CN,zh;q=0.9',
    "Connection": 'keep-alive',
    "Content-Length": 0,
    "Cookie": 'pgv_pvi=9071223808; pgv_si=s8260110336; ftzjjszgovcn=0; arialoadData=true; nowKeyWord=29280; zlpt-session-id_test=c2f07da0-108d-4748-839d-a449dc451b8a; cookie_3.36_8080=85416329; ASP.NET_SessionId=yrqlhuuw3s0lszmc3aglcoyt; AD_insert_cookie_89188=26082198; ariawapChangeViewPort=false; Hm_lvt_ddaf92bcdd865fd907acdaba0285f9b1=1678462240,1678500003; Hm_lpvt_ddaf92bcdd865fd907acdaba0285f9b1=1678500192',
    "Host": 'zjj.sz.gov.cn:8004',
    "Referer": 'http://zjj.sz.gov.cn:8004/public/marketInfo/tmcDayDealInfo.html',
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
};


async function getHttp(url) {
    const res = await axios({ url, method: 'post', headers, timeout: 10000 });
    console.log('res', JSON.stringify(res.data));
    const { xmlDateMonth, xmlDateDay, dataTs, dataMj } = res.data.data;
    // const dataTsObj = dataTs.reduce((acc, cur) => {
    //     acc[cur.name] = cur.value;
    //     return acc;
    // }, {});
    const date = xmlDateDay.replace(/年|月/g, "-").replace("日", "");
    const dataMjObj = dataMj.reduce((acc, cur) => {
        acc[cur.name] = cur.value;
        return acc;
    }, {});

    const updateData = dataTs.map((item) => {
        const update = {
            "city": "深圳",
            "district": item.name,
            "bargainType": "二手",
            "houseType": "住宅",
            "date": date,
            "dateUnix": moment(new Date(date)).unix(),
            "square": `${dataMjObj[item.name]}m²`,
            "quantity": `${item.value}套`
        };
        const filter = { "city": "深圳", "district": item.name, "houseType": "住宅", "date": xmlDateDay };
        return { updateOne: { filter, update, upsert: true } };
    });
    // const updateData = res.data.map((item) => {
    //     const update = {
    //         "city" : "深圳",
    //         "district" : item.ZONE,
    //         "bargainType" : "二手",
    //         "houseType" : item.HOUSE_USAGE2,
    //         "date" : item.TJ_DATE,
    //         "dateUnix" : moment(new Date(item.TJ_DATE)).unix(),
    //         "square" : `${item.CJ_AREA}m²`,
    //         "quantity" : `${item.CJ_NUM}套`
    //     };
    //     const filter = {"city" : "深圳", "district" : item.ZONE, "houseType" : item.HOUSE_USAGE2, "date" : item.TJ_DATE};
    //     return {updateOne: {filter, update, upsert: true}};
    // });
    logger.info('updateData', JSON.stringify(updateData));
    await houseBargainModel.bulkWrite(updateData);
}
async function main() {
    try {
        // await getHttp('https://opendata.sz.gov.cn/data/dataSet/getPreviewData?tableName=zjj_esfcjxxartj&resId=29200%2F01903513&_=1678464754359');
        await getHttp('http://zjj.sz.gov.cn:8004/api/marketInfoShow/getEsfCjxxGsData');
        logger.info('get sz house bargin data successfully');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

