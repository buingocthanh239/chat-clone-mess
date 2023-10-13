const formidable = require('formidable');
const MessageModel = require('../model/MessageModel');
const User = require('../model/authModel');
const fs = require('fs')

module.exports.getFriends = async (req, res, next) => {
    const myId = req.myId;
    try {
        const users = await User.find({
            _id : { 
                $ne: myId
             }
        }); 
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (err) {
        res.status(500).json({
            error: {
                errorMessage: ['Intervnal Server Error']
            }
        })
    }
}

module.exports.postMessage = async (req, res, next) => {
    const { reseverId, message } = req.body;
    const senderId = req.myId;
    try {  
        const newMessage = await  MessageModel.create({
            senderId,
            reseverId,
            message: {
                text: message,
                image: ''
            }
        })
        res.status(200).json({
            success: true,
            message: newMessage
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                errMessage: 'Internal Server Error'
            }
        })
    }
}

module.exports.postImage = async (req, res, next) => {
    const senderId = req.myId;
    const form = formidable();
    form.parse(req, async (err, fields, files)  => {
        const { reseverId } = fields;
        if(err) {
            return res.status(400).json({
                success: false,
                 error: {
                    errorMessage: 'error to up load image'
                 }
            })
        }
        const getImageName = files.image.originalFilename;
        const ramdumNumber = Math.floor(Math.random() *9999);
        const newImageName = ramdumNumber + getImageName;
        files.image.originalFilename = newImageName
        const newPath = __dirname + `../../../frontend/public/image/${files.image.originalFilename}`
        fs.copyFile(files.image.filepath, newPath, async (error) => {
            if(error) {
                return res.status(500).json({
                    success: false,
                     error: {
                        errorMessage: 'Internal server error'
                     }
                })
            }
            const newMessage = await  MessageModel.create({
                senderId,
                reseverId,
                message: {
                    text: '',
                    image: files.image.originalFilename
                }
            })
            res.status(200).json({
                success: true,
                message: newMessage
            })
        })
    })
}



module.exports.getMessageWithIdUser = async (req, res, next) => {
    const {reseverId} = req.params
    const senderId = req.myId
    try {
        const messages = await MessageModel.find({
            $or: [
                { $and: [{ reseverId: reseverId, senderId: senderId}]},
                { $and: [{senderId: reseverId, reseverId: senderId}]}
            ]
        })
        res.status(200).json({
            success: true,
            data: messages
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            error: {
                errorMessage: 'Internal Server Error'
            }
        })
    }
}