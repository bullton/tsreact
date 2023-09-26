const axios = require('axios');
const myCheerio = require('cheerio');
const mongoose = require('mongoose');
const {monitorsModel} = require('../models');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger();
require('ssl-root-cas').inject();
logger.level = 'info';
const https = require('https')

// 在 axios 请求时，选择性忽略 SSL
const agent = new https.Agent({
  rejectUnauthorized: false
})


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
    // "Referer": "http://fgj.hangzhou.gov.cn/",
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

function generateUpdateData(updateData, httpModule, now, date, bargainType) {
    for (let i=1; i<27;i+=2) {
        const data = {
            city: '杭州',
            district: httpModule[0].children[i].children[1].children[0].data,
            bargainType,
            houseType: '住宅',
            square: httpModule[0].children[i].children[9].children[0].data,
            quantity: httpModule[0].children[i].children[7].children[0].data,
            dateUnix: now,
            date
        };
        const dataAll2HandBargain = {
            city: '杭州',
            district: httpModule[0].children[i].children[1].children[0].data,
            bargainType,
            houseType: '住商',
            square: httpModule[0].children[i].children[5].children[0].data,
            quantity: httpModule[0].children[i].children[3].children[0].data,
            dateUnix: now,
            date
        };
        updateData.push(data);
        updateData.push(dataAll2HandBargain);
    }
}

async function getHttp(url, keyWords, label, m, updateData) {
    const res = await axios({url, verify: false, method: 'get', headers, httpsAgent: agent, timeout: 10000, encoding: null});
    const $ = myCheerio.load(res.data, { decodeEntities: true, ignoreWhitespace: true });
    // const p = Object.values($('p'));
    // const p = eval($('.date'));
    // console.log('dsdfasdf', p[7]);
    const newTitles = [];
    const now = moment().unix();
    for (const keyWord of keyWords) {
        const searchStr = `${label}:contains("${keyWord}")`;
        const p = $(searchStr);
        const title = $(p).text();
        if (!(m.historyTitle || []).includes(title)) {
            newTitles.push(title);
        } 
    }
    if (newTitles.length) {
        // if (m.historyTitle && m.historyTitle.length) {
        //     m.historyTitle.push(JSON.stringify(newTitles));
        // } else {
        //     m.historyTitle = [JSON.stringify(newTitles)];
        // }
        updateData.push({updateOne: {
            filter: {_id: mongoose.Types.ObjectId(m._id)},
            update: {
                $set: {
                getText: newTitles,
                updateTime: now
                },
                $push: {historyTitle: {$each : newTitles}} 
            },
            upsert: false
        }});
    }
    
    // const p = $('p:contains("學位")');
    // 
    // const now = moment().unix();
    // const date = moment().format('YYYY-MM-DD');
    
    // const newP = p.filter((item) => {
    //     // return item.children && item.children.length && item.children[0].type && item.children[0].type === 'text';
    //     return item.children && item.children.length && item.children[0] && item.children[0].data && item.children[0].data.includes('學位');

    // });
    
    // for (const item of p) {
    //     console.log('ch', item.data);
    // }
    // generateUpdateData(updateData, ershow, now, date, '二手')
    // const newHouse = $("#con1");
    // generateUpdateData(updateData, newHouse, now, date, '新房')
    // logger.info('updateData', JSON.stringify(updateData));
    // await houseBargainModel.insertMany(updateData);
}
async function main() {
    // try {
        const monitors = await monitorsModel.find({schoolId: '65113aa0429da644d9efdec0'});
        const udpateData = [];
        for (const m of monitors) {
            await getHttp(m.link, m.keyWords, m.label, m, udpateData);
        }
        console.log('update', udpateData);
        const r = await monitorsModel.bulkWrite(udpateData);
        // await getHttp('https://www.kcobaps2.edu.hk/tc/latest_news');
        process.exit(0);
//     } catch (e) {
//         logger.error(`Error: ${e}`);
//         process.exit(1);
//     }
}

main()

