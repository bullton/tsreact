const axios = require('axios');
const { bigexamModel } = require('../models');
const myCheerio = require('cheerio');
const csv = require('fast-csv');
const fs = require('fs');
const moment = require('moment');
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = 'info';


const updateData = [];

fs.createReadStream('./bigexam.csv')
    .pipe(csv.parse({ headers: true }))
    .on('data', (row) => {
        const filter = { "schoolId": row.schoolId };
        updateData.push({ updateOne: { filter, update: row, upsert: false } });
    })
    .on('end', async () => {
        await bigexamModel.bulkWrite(updateData);
        logger.info('csv...end', updateData.length);
        process.exit(0);
    });
