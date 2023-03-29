const express = require('express')
const router = express.Router()
const { mccModel, validMccModel, houseBargainModel, houseListingsModel } = require('../models');
const xlsx = require('xlsx');
const { query } = require('express');

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


module.exports = router
