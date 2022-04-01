const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        min: 1,
        max: 20,
    },

    password: {
        type: String,
        required: true,
        min: 8,
        max: 32,
    },

    date: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("User", userSchema);