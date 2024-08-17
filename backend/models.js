const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
const options = { user : "mybank", pass : "282400245", auth : {authMechanism: 'MONGODB-CR'}, useNewUrlParser: true }
mongoose.connect('mongodb://120.77.77.148:27017/mybank', options)

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

const hongkongPSSchema = new mongoose.Schema({
    name: { type: String }, //0
    type: { type: String }, //1
    district: { type: String }, //2
    net: { type: String }, //3
    relation: { type: String }, //4
    sex: { type: String }, //5
    religion: { type: String } //6
});

const monitorsSchema = new mongoose.Schema({
    schoolId: { type: String }, //0
    monitorType: { type: String }, //1
    keyWords: { type: Array }, //2
    link: { type: String }, //3
    addUser: { type: String }, //4
    updateTime: { type: Number }, //5
    addTime: { type: Number }, //6
    label: { type: String },
    getText: {type: Array},
    historyTitle: { type: Array }
    
});

const bigexamSchema = new mongoose.Schema({
    schoolId: { type: String, unique: true}, //schId
    ename: { type: String }, //ename
    cname: { type: String }, //cname
    dist: { type: String }, //dist
    schoolType: { type: String }, //type.name
    gend: { type: String }, //gend.name
    religion: { type: String }, //religion
    chiRatio: { type: Number }, //sai.2024
    band: {type: String}, //band.name
    bandAccuracy: { type: String }, //band.rel 0=no data, 1=Rough estimate, 2=Middle estimate, 3=High Accuracy
    bandTrend: { type: Number }, //bandTrend
    bandFluct: { type: Boolean }, //bandFluct
    rankUpper: { type: Number }, //rank
    rankLower: { type: Number }, //rank
    stopS1: {type: Number} //stopS1 stop S1 from xxxx year
});

const mccModel = mongoose.model('mccs', mccSchema);
const validMccModel = mongoose.model('valid_mccs', validMccSchema);
const houseBargainModel = mongoose.model('houseBargain', houseBargainSchema);
const houseListingsModel = mongoose.model('houseListings', houseListingsSchema);
const estateModel = mongoose.model('estate', estateSchema);
const estateBargainModel = mongoose.model('estateBargain', estateBargainSchema);
const hongkongMiddleSchoolModel = mongoose.model('hongkongMiddleSchool', hongkongMiddleSchoolSchema);
const monitorsModel = mongoose.model('monitors', monitorsSchema);
const hongkongPSModel = mongoose.model('hongkongprimaryschools', hongkongPSSchema);
const bigexamModel = mongoose.model('bigExamSchools', bigexamSchema);
module.exports = { mccModel, validMccModel, houseBargainModel, houseListingsModel, estateModel, estateBargainModel, hongkongMiddleSchoolModel, monitorsModel, hongkongPSModel, bigexamModel };
