const mongoose = require("mongoose");
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') })
 const db=process.env.DATA_BASE

mongoose.connect(db, {
    useNewUrlParser: true
})