const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mybank', {
    useNewUrlParser: true
})

const mccSchema = new mongoose.Schema({
    mcc: {type: String, unique: true},
    name: {type: String},
    bank: {type: String}
});

const validMccSchema = new mongoose.Schema({
    code: {type: String, unique: true},
    valid: {type: Number},
    type: {type: String}
});

const houseBargainSchema = new mongoose.Schema({
    city: {type: String},
    district: {type: String},
    bargainType: {type: String},
    houseType: {type: String},
    date: {type: String},
    dateUnix: {type: Number},
    square: {type: String},
    quantity: {type: String},
});

const mccModel = mongoose.model('mccs', mccSchema);
const validMccModel = mongoose.model('valid_mccs', validMccSchema);
const houseBargainModel = mongoose.model('houseBargain', houseBargainSchema);
module.exports = {mccModel, validMccModel, houseBargainModel};
