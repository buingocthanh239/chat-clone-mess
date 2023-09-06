const formidable = require('formidable');
const validator = require('validator');
const  userSchema  = require('../model/authModel')
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

module.exports.userRegister = (req, res, next) => {
    const form = formidable();
    form.parse(req, async (err, fields, files) => {
        const { username, email, password, confirmPassword } = fields;

        if(err) {
            res.status(400).json({
                 error: {
                    errorMessage: ['error to up load image']
                 }
            })
       }
        const {image} = files;
        const error = [];
        if (!username) {
            error.push('username is required')
        }
        if (!email) {
            error.push('email is required')
        }
        if (!password) {
            error.push('password is required')
        }
        if (!confirmPassword) {
            error.push('confirmPassword is required')
        }
        if(email && !validator.isEmail(email)) {
            error.push('email must be a valid email')
        }
        if (password && password.length < 6) {
            error.push('password must be at least 6 characters')
        }
        if (password && confirmPassword && confirmPassword !== password) {
            error.push('confirmPassword must be equal password')
        }
        if (Object.keys(files).length === 0) {
            error.push('image is required')
        }
        if (error.length > 0) {
            res.status(400).json({
                error: {
                    errorMessage: error
                }
            })
        } else {
            const checkUser = await userSchema.findOne({ email: email});
            if (checkUser) {
                return res.status(400).json({
                    error: {
                        errorMessage: ['email is existed']
                    }
                })
            }
            const getImageName = files.image.originalFilename;
            const ramdumNumber = Math.floor(Math.random() *9999);
            const newImageName = ramdumNumber + getImageName;
            files.image.originalFilename = newImageName
            const newPath = __dirname + `../../../frontend/public/image/${files.image.originalFilename}`
            fs.copyFile(files.image.filepath, newPath, async (error) => {
                if (!error) {
                    const createNewUser = await  userSchema.create({
                        username, 
                        password: await bcrypt.hash(password, 10), 
                        email,
                        image: files.image.originalFilename
                    })
                    res.status(200).json({
                        successMessage: 'Your register successful'
                    })
                } else {
                    res.status(500).json({
                        error: {
                            errorMessage: ['Internal Server Error']
                        }
                    })
                }
            })

        }
    })
} 

module.exports.loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    const error = [];
    if (!email) {
        error.push('email is required')
    }
    if (!password) {
        error.push('password is required')
    }
    if(email && !validator.isEmail(email)) {
        error.push('email must be a valid email')
    }
    if (password && password.length < 6) {
        error.push('password must be at least 6 characters')
    }
    if (error.length > 0) {
        res.status(400).json({
            error: {
                errorMessage: error
            }
        })
    } else {
        try {
            const currUser = await userSchema.findOne({ email: email})
            if (!currUser || !bcrypt.compare(password, currUser.password)) {
                res.status(400).json({
                    error: {
                        errorMessage: ['email or password is incorrect']
                    }
                })
            } else {
                const token = jwt.sign({
                    id: currUser._id,
                    username: currUser.username,
                    email: currUser.email,
                    image: currUser.image,
                    registerTime: currUser.createdAt
                }, process.env.SECRET_KEY, {
                    expiresIn: process.env.TOKEN_EXP
                })
                const options = { expires : new Date(Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000 )}
                res.status(200).cookie('authToken',token, options).json({
                    successMessage: 'login successfully',
                    token: token
                })
            }
        } catch (err) {
            res.status(500).json({
                error: {
                    errorMessage: ['Internal Server Error'],
                    error : [err]
                }
            })
        }
    }
    
}