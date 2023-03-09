import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/mybank');

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

const houseBargainModel = mongoose.model('houseBargain', houseBargainSchema);
module.exports = {houseBargainModel};
