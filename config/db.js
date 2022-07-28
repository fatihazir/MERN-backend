const mongoose = require('mongoose')

async function ConnectDb() {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`Mongo db connected : ${conn.connection.host}`.cyan.underline.bold)
}

module.exports = ConnectDb