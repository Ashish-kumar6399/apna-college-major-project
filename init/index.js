const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing.js');

const MONGO_URL = "mongodb+srv://ashishkumar541712:3gFIXd3wnzxIBzdJ@cluster0.0vis0.mongodb.net/wandrlust?retryWrites=true&w=majority&appName=Cluster0";


main()
    .then(() => {
        console.log("Connected to the db server");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL)
        .then(() => {
            console.log("db connection suckseed.")
        })
        .catch(e => {
            console.log("failed to connnect." + e)
        });
}


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj, owner:"67ec4618d9084031ad598e09",
    }));

    await Listing.insertMany(initData.data);
    console.log("Database initialized");
};



initDB();