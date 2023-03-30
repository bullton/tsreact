// import mongoose from "mongoose";
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mybank');

const houseListingsSchema = new mongoose.Schema({
    city: { type: String },
    listingsType: { type: String },
    houseType: { type: String },
    date: { type: String },
    dateUnix: { type: Number },
    quantity: { type: Number },
});

const houseListingsModel = mongoose.model('houseListings', houseListingsSchema);
module.exports = { houseListingsModel };
