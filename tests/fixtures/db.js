const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User=require("./../../src/models/user")

const userId = new mongoose.Types.ObjectId();
const user = {
    _id: userId,
    tokens: [{ token: jwt.sign({ _id: userId }, "ragheb111") }],
    name: "ragheb gamal",
    email: "raghebgamal111@gmail.com",
    age: 28,
    password: "ragheb111"
};

const setDB = async () => {
     await User.deleteMany();
    await User.create(user)
};

module.exports = {
    userId,
    user,
    setDB
};