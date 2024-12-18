const axios = require('axios');
const { bigexamModel } = require('../models');
const myCheerio = require('cheerio');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';


// const exampleData = {
//     "data": [
//         {
//             "schId": 395,
//             "ename": "Aberdeen Baptist Lui Ming Choi College",
//             "cname": "香港仔浸信會呂明才書院",
//             "dist": "Southern",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED", //资助
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED", //男女校
//                 "name": "Co-ed"
//             },
//             "religion": "Christianity", //宗教
//             "sai": {
//                 "2024": 0.878 //中文比例
//             },
//             "band": {
//                 "name": "2C",
//                 "rel": 3 //准确
//             },
//             "bandTrend": 0,
//             "bandFluct": false,
//             "rank": [
//                 269,
//                 277
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 394,
//             "ename": "Aberdeen Technical School",
//             "cname": "香港仔工業學校",
//             "dist": "Southern",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED",
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_BOYS",
//                 "name": "Boys"
//             },
//             "religion": "Catholicism",
//             "sai": {
//                 "2024": 0.818
//             },
//             "band": {
//                 "name": "3", //估计
//                 "rel": 0 //No data
//             },
//             "bandTrend": null,
//             "bandFluct": false,
//             "rank": [
//                 379,
//                 389
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 174,
//             "ename": "Academy of Innovation (Confucius Hall)",
//             "cname": "孔聖堂禮仁書院",
//             "dist": "Wan Chai",
//             "type": {
//                 "code": "STR_SCHTYPE_DSS",
//                 "name": "DSS"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED",
//                 "name": "Co-ed"
//             },
//             "religion": null,
//             "sai": {
//                 "2024": 0.517
//             },
//             "band": {
//                 "name": "3A–2C",
//                 "rel": 1 //估计
//             },
//             "bandTrend": 0,
//             "bandFluct": false,
//             "rank": [
//                 275,
//                 314
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 34,
//             "ename": "AD&FD POHL Leung Sing Tak College",
//             "cname": "博愛醫院歷屆總理聯誼會梁省德中學",
//             "dist": "Tsuen Wan",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED",
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED",
//                 "name": "Co-ed"
//             },
//             "religion": null,
//             "sai": {
//                 "2024": 0.534
//             },
//             "band": {
//                 "name": "2B",
//                 "rel": 1
//             },
//             "bandTrend": 0,
//             "bandFluct": false,
//             "rank": [
//                 184,
//                 201
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 271,
//             "ename": "Assembly of God Hebron Secondary School",
//             "cname": "神召會康樂中學",
//             "dist": "Tai Po",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED",
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED",
//                 "name": "Co-ed"
//             },
//             "religion": "Christianity",
//             "sai": {
//                 "2024": 1
//             },
//             "band": {
//                 "name": "3",
//                 "rel": 0
//             },
//             "bandTrend": null,
//             "bandFluct": false,
//             "rank": [
//                 303,
//                 314
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 161,
//             "ename": "Baptist Lui Ming Choi Secondary School",
//             "cname": "浸信會呂明才中學",
//             "dist": "Shatin",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED",
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED",
//                 "name": "Co-ed"
//             },
//             "religion": "Christianity",
//             "sai": {
//                 "2024": 0.305
//             },
//             "band": {
//                 "name": "1A",
//                 "rel": 3
//             },
//             "bandTrend": 0,
//             "bandFluct": false,
//             "rank": [
//                 25,
//                 39
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 162,
//             "ename": "Baptist Wing Lung Secondary School",
//             "cname": "浸信會永隆中學",
//             "dist": "Tuen Mun",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED",
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED",
//                 "name": "Co-ed"
//             },
//             "religion": "Christianity",
//             "sai": {
//                 "2024": 0.554
//             },
//             "band": {
//                 "name": "2",
//                 "rel": 0
//             },
//             "bandTrend": null,
//             "bandFluct": false,
//             "rank": [
//                 227,
//                 265
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 27,
//             "ename": "Belilios Public School",
//             "cname": "庇理羅士女子中學",
//             "dist": "Eastern",
//             "type": {
//                 "code": "STR_SCHTYPE_GOVT",
//                 "name": "Gov’t"
//             },
//             "gend": {
//                 "code": "STR_GEND_GIRLS",
//                 "name": "Girls"
//             },
//             "religion": null,
//             "sai": {
//                 "2024": 0.039
//             },
//             "band": {
//                 "name": "1A",
//                 "rel": 3
//             },
//             "bandTrend": 0,
//             "bandFluct": false,
//             "rank": [
//                 25,
//                 37
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 30,
//             "ename": "Bethel High School",
//             "cname": "伯特利中學",
//             "dist": "Yuen Long",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED",
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED",
//                 "name": "Co-ed"
//             },
//             "religion": "Christianity",
//             "sai": {
//                 "2024": 0.561
//             },
//             "band": {
//                 "name": "3B",
//                 "rel": 2 //中间准确
//             },
//             "bandTrend": 0,
//             "bandFluct": false,
//             "rank": [
//                 367,
//                 408
//             ],
//             "stopS1": null
//         },
//         {
//             "schId": 123,
//             "ename": "Bishop Hall Jubilee School",
//             "cname": "何明華會督銀禧中學",
//             "dist": "Kowloon City",
//             "type": {
//                 "code": "STR_SCHTYPE_AIDED",
//                 "name": "Aided"
//             },
//             "gend": {
//                 "code": "STR_GEND_COED",
//                 "name": "Co-ed"
//             },
//             "religion": "Christianity",
//             "sai": {
//                 "2024": 0.031
//             },
//             "band": {
//                 "name": "1B",
//                 "rel": 1
//             },
//             "bandTrend": 0,
//             "bandFluct": false,
//             "rank": [
//                 77,
//                 103
//             ],
//             "stopS1": null
//         }
//     ],
//     "sBins": [
//         112,
//         22,
//         51,
//         30,
//         45,
//         21,
//         55,
//         44,
//         18,
//         46
//     ],
//     "bBins": [
//         49,
//         63,
//         28,
//         30,
//         40,
//         71,
//         83,
//         55,
//         20
//     ],
//     "t": 445,
//     "years": [
//         2024,
//         2023
//     ],
//     "ps": 10,
//     "p": 1
// };



const headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Encoding": "gzip, deflate",
    "Accept-Language": 'zh-CN,zh;q=0.9',
    "Connection": 'keep-alive',
    "Content-Length": 0,
    "Cookie": 'pgv_pvi=9071223808; pgv_si=s8260110336; ftzjjszgovcn=0; arialoadData=true; nowKeyWord=29280; zlpt-session-id_test=c2f07da0-108d-4748-839d-a449dc451b8a; cookie_3.36_8080=85416329; ASP.NET_SessionId=yrqlhuuw3s0lszmc3aglcoyt; AD_insert_cookie_89188=26082198; ariawapChangeViewPort=false; Hm_lvt_ddaf92bcdd865fd907acdaba0285f9b1=1678462240,1678500003; Hm_lpvt_ddaf92bcdd865fd907acdaba0285f9b1=1678500192',
    "Host": 'dse.bigexam.hk',
    "Referer": 'https://dse.bigexam.hk/en/ssp?p=1&order=name&asc=1',
    "User-Agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
};

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function getSchoolDetail(id) {
    const url = `https://dse.bigexam.hk/zh-cn/ssp/school/`;
    console.log('url', url);
    const headers2 = {
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
    const res = await axios({ url: url.concat(id), verify: false, method: 'get', headers: headers2, timeout: 100000, encoding: null });
    const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
    // const locateInfo = JSON.stringify($('div.main-content')[0].children[30].children[0].data);
    eval($('div.main-content')[0].children[30].children[0].data);
    console.log('bandCurve', bandCurve ? bandCurve.length : 0);
    return { bandCurve, bandInfo, subjs, rank };
}

async function getHttp(url) {
    for (let i = 1; i <= 45; i++) {
        sleep(1000);
        const params = { 'p': i, order: 'name', asc: 1 };
        const res = await axios({ url, method: 'post', params, headers, timeout: 10000 });
        console.log('res', JSON.stringify(res.data.data));
        const updateData = [];
        for (const item of res.data.data) {
            const { bandCurve, bandInfo, subjs, rank } = await getSchoolDetail(item.schId);
            const update = {
                "schoolId": item.schId,
                "ename": item.ename, //ename
                "cname": item.cname, //cname
                "dist": item.dist, //dist
                "schoolType": item.type.name, //type.name
                "gend": item.gend.name, //gend.name
                "religion": item.religion, //religion
                "chiRatio": item.sai['2025'], //sai.2025
                "band": item.band ? item.band.name : null, //band.name
                "bandAccuracy": item.band ? item.band.rel : null, //band.rel 0=no data, 1=Rough estimate, 2=Middle estimate, 3=High Accuracy
                "bandTrend": item.bandTrend, //bandTrend
                "bandFluct": item.bandFluct, //bandFluct
                "rankUpper": item.rank ? item.rank[0] : null, //rank
                "rankLower": item.rank ? item.rank[1] : null, //rank
                "stopS1": item.stopS1, //stopS1 stop S1 from xxxx year
                "bandCurve": bandCurve || [],
                "subjs": subjs || [],
                "rank": rank || []
            };
            Object.assign(update, bandInfo || {});
            const filter = { "schoolId": item.schId };
            updateData.push({ updateOne: { filter, update, upsert: true } });
        }
        await bigexamModel.bulkWrite(updateData);

    }

}
async function main() {
    try {
        await getHttp('https://dse.bigexam.hk/en/ajax/sspFltr');
        logger.info('get data from bigexam end');
        process.exit(0);
    } catch (e) {
        logger.error(`Error: ${e}`);
        process.exit(1);
    }
}

main()

