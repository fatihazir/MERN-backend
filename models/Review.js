const mongoose = require('mongoose')

const ReviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title']
    },
    text: {
        type: String,
        required: [true, 'Please add a text']
    },
    rating: {
        type: Number,
        required: [true, 'Please add a rating']
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
})

module.exports = mongoose.model('Review', ReviewSchema)