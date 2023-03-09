const {validMccModel} = require('../models');

async function main () {
    const mccs = await validMccModel.findOne({});
    console.log(mccs);
}

main();


