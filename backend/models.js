const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mybank', {
    useNewUrlParser: true
})

const mccSchema = new mongoose.Schema({
    mcc: { type: String, unique: true },
    name: { type: String },
    bank: { type: String }
});

const validMccSchema = new mongoose.Schema({
    code: { type: String, unique: true },
    valid: { type: Number },
    type: { type: String }
});

const houseBargainSchema = new mongoose.Schema({
    city: { type: String },
    district: { type: String },
    bargainType: { type: String },
    houseType: { type: String },
    date: { type: String },
    dateUnix: { type: Number },
    square: { type: String },
    quantity: { type: String },
});

const estateSchema = new mongoose.Schema({
    city: { type: String },
    district: { type: String },
    area: { type: String },
    name: { type: String },
    buildTime: { type: String },
    propertyFee: { type: Number },
    propertyCompany: { type: String },
    developer: { type: String },
    totalBuilding: { type: Number },
    totalHouse: { type: Number },
    ljId: { type: String }
});

const estateBargainSchema = new mongoose.Schema({
    ljId: { type: String },
    name: { type: String },
    salingTotal: {type: Number},
    bargainTotalInNinetyDays: {type: Number},
    viewingInThirtyDays: {type: Number},
    date: { type: String },
    dateUnix: { type: Number }
    
});



const mccModel = mongoose.model('mccs', mccSchema);
const validMccModel = mongoose.model('valid_mccs', validMccSchema);
const houseBargainModel = mongoose.model('houseBargain', houseBargainSchema);
const estateModel = mongoose.model('estate', estateSchema);
const estateBargainModel = mongoose.model('houseBargain', estateBargainSchema);
module.exports = { mccModel, validMccModel, houseBargainModel, estateModel, estateBargainModel };
