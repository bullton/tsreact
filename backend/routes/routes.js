const express = require('express')
const router = express.Router()
const { mccModel, validMccModel, houseBargainModel, houseListingsModel, estateModel, estateBargainModel, monitorsModel, hongkongMiddleSchoolModel, hongkongPSModel } = require('../models');
const xlsx = require('xlsx');
const { query } = require('express');
const moment = require('moment');


router.get('/api/check/merchant_code', async (req, res) => {
    const { totalMerchantCode } = req.query;
    const mccs = await mccModel.findOne({ mcc: totalMerchantCode.toString() });
    res.send(mccs);
})

router.get('/api/check/mcc', async (req, res) => {
    const { mcc } = req.query;
    console.log('mcc', mcc);
    const mccs = await validMccModel.findOne({ code: mcc.toString() });
    console.log('mccs', mccs);
    res.send(mccs);
})

router.get('/api/house', async (req, res) => {
    const { houseType, city, date, bargainType, startDate, endDate } = req.query;
    const filter = {};
    houseType && (filter.houseType = houseType);
    city && (filter.city = city);
    date && (filter.date = date);
    if (startDate || endDate) {
        filter.dateUnix = {};
        startDate && (filter.dateUnix['$gte'] = startDate);
        endDate && (filter.dateUnix['$lte'] = endDate);
    }
    bargainType && (filter.bargainType = bargainType);
    const houseList = await houseBargainModel.find(filter);
    res.send(houseList);
})

router.get('/api/listings', async (req, res) => {
    const { houseType, city, date, bargainType, startDate, endDate } = req.query;
    const filter = {};
    houseType && (filter.houseType = houseType);
    city && (filter.city = city);
    date && (filter.date = date);
    if (startDate || endDate) {
        filter.dateUnix = {};
        startDate && (filter.dateUnix['$gte'] = startDate);
        endDate && (filter.dateUnix['$lte'] = endDate);
    }
    bargainType && (filter.bargainType = bargainType);
    const listings = await houseListingsModel.find(filter);
    res.send(listings);
})

router.get('/api/estates', async (req, res) => {
    const { city } = req.query;
    const filter = {};
    city && (filter.city = city);
    const estates = await estateModel.find(filter);
    const estatesSell = await estateBargainModel.find({});
    const sellInfo = estatesSell.reduce((acc, cur) => {
        acc[cur.ljId] = cur;
        return acc;
    }, {});
    res.send({ estates, sellInfo });
})

router.get('/api/monitor', async (req, res) => {
    console.log('req.query', req.params);
    const { data, action = 'find' } = req.query;
    const filter = {};
    if (data && data.length) {
        data[0].schoolId && (filter.schoolId = data[0].schoolId);
        data[0].monitorType && (filter.monitorType = data[0].monitorType);
        data[0].addUser && (filter.addUser = data[0].addUser);
    }
    console.log('filter', filter);
    const dbModel = monitorsModel;
    const { metaData, mainData } = await handleData({ action, dbModel, data, filter, task: [hongkongMiddleSchoolModel, hongkongPSModel] });
    res.send({ metaData, monitors: mainData });
})

router.post('/api/monitor/add', async (req, res) => {
    const {data} = req.query;
    const dbModel = monitorsModel;
    for (const d of data) {
        d.addTime = moment().unix();
        d.addUser = 'bullton'
    }
    const result = await handleData({ action: 'add', dbModel, data, filter: {}, task: [] });
    res.send({ result });
})

router.get('/api/sold', async (req, res) => {
    const { ljId } = req.query;
    const filter = { ljId };
    console.log('ljId', filter);
    const estates = await estateBargainModel.find(filter);
    res.send(estates);
})

async function handleData({ action, dbModel, data, filter, task }) {
    if (action === 'add' && data && data.length) {
        return await dbModel.insertMany(data);
    } else if (action === 'edit') {
        //
    } else if (action === 'delete') {
        //
    } else if (action === 'find') {
        const metaData = {};
        for (const item of task) {
            const findData = await item.find();
            const findObj = findData.reduce((acc, cur) => {
                acc[cur._id.toString()] = cur;
                return acc;
            }, {});
            metaData[item.modelName] = findObj;
        }
        const mainData = await dbModel.find(filter);
        return { metaData, mainData };
    } else {
        return {};
    }
}


module.exports = router
