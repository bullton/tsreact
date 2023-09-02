const mongoose = require('mongoose');

const options = { user : "mybank", pass : "282400245", auth : {authMechanism: 'MONGODB-CR'}, useNewUrlParser: true }
mongoose.connect('mongodb://127.0.0.1:27017/mybank', options)

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

const houseListingsSchema = new mongoose.Schema({
    city: { type: String },
    listingsType: { type: String },
    houseType: { type: String },
    source: { type: String },
    date: { type: String },
    dateUnix: { type: Number },
    quantity: { type: Number },
});

const estateSchema = new mongoose.Schema({
    city: { type: String },
    district: { type: String },
    area: { type: String },
    name: { type: String },
    buildTime: { type: String },
    buildType: { type: String },
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
    sellNum: { type: Number },
    day90Sold: { type: Number },
    day30See: { type: Number },
    date: { type: String },
    dateUnix: { type: Number },
    district: { type: String },
    area: { type: String }
});

const hongkongMiddleSchoolSchema = new mongoose.Schema({
    name: { type: String }, //0
    type: { type: String }, //1
    district: { type: String }, //2
    banding: { type: String }, //3
    lang: { type: String }, //4
    sex: { type: String }, //5
    religion: { type: String } //6
});

const mccModel = mongoose.model('mccs', mccSchema);
const validMccModel = mongoose.model('valid_mccs', validMccSchema);
const houseBargainModel = mongoose.model('houseBargain', houseBargainSchema);
const houseListingsModel = mongoose.model('houseListings', houseListingsSchema);
const estateModel = mongoose.model('estate', estateSchema);
const estateBargainModel = mongoose.model('estateBargain', estateBargainSchema);
const hongkongMiddleSchoolModel = mongoose.model('hongkongMiddleSchool', hongkongMiddleSchoolSchema);
module.exports = { mccModel, validMccModel, houseBargainModel, houseListingsModel, estateModel, estateBargainModel, hongkongMiddleSchoolModel };
