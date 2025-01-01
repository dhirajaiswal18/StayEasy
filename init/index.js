const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/megaproject";

main().then(() => {
    console.log("connected to DATABSE");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "676bba84f6d2b0cac7842d22",
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();


