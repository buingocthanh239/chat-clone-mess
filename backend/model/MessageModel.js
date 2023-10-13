const { Schema, model} = require('mongoose')

const messageModel = new Schema({
    senderId: {
        type: String,
        required: true,
    }, 
    reseverId: {
        type: String,
        required: true
    },
    message: {
        text: {
            type: String,
        },
        image: {
            type: String,
        }
    },
    status: {
        type: String,
        default: 'unseen'
    },

}, {timestamps: true});

module.exports = model('message', messageModel)