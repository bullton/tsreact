const {mccModel} = require('./models');
const xlsx = require('xlsx');

async function initMcc() {
    for (let i = 1; i <= 5; i++) {
        const fileName = `./xlsx/0${i}.xlsx`;
        console.log('fileName', fileName);
        const workbook = xlsx.readFile(fileName);
        const name = workbook.SheetNames[0];
        console.log('name', name);
        const sheet = workbook.Sheets[name];
        for (let k = 1; k <=4; k++) {
            const dataList = [];
            for (let j = k===1?2:(100000*(k-1)); j<=(100000*k); j++) {
                // console.log('index', `A${j}`, `B${j}`);
                if (sheet[`A${j}`] && sheet[`B${j}`]) {
                    const updateOne = {updateOne: {
                        filter: {mcc: sheet[`A${j}`].v},
                        update: {$set: {
                            mcc: sheet[`A${j}`].v,
                            name: sheet[`B${j}`].v,
                            bank: 'CITIC'
                        }},
                        upsert: true
                    }};
                    dataList.push(updateOne);
                } else {
                    console.log(`A${j}`, sheet[`A${j}`]);
                    console.log(`B${j}`, sheet[`B${j}`]);
                }
                
            }
            console.log(`${fileName} length`, dataList.length, JSON.stringify(dataList[0]));
            const r = await mccModel.bulkWrite(dataList);
            console.log(`${fileName} done`, r);
        }
        
    }
}

initMcc();
