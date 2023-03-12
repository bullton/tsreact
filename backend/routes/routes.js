const express = require('express')
const router = express.Router()
const { mccModel, validMccModel, houseBargainModel } = require('../models');
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
    const { houseType } = req.query;
    const hourse = await houseBargainModel.find({ houseType });
    res.send(hourse);
})


module.exports = router
