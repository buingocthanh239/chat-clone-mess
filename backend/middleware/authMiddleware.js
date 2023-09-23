const jwt = require('jsonwebtoken')
module.exports.authMiddleware = async (req, res, next) => {
    const {authToken} = req.cookies;
    try {
        if (authToken) {
            const decodeToken = await jwt.verify(authToken, process.env.SECRET_KEY) 
            req.myId = decodeToken.id;
            next();
        } else {
            res.status(401).json({
                error: {
                    errorMessage: ['Unauthorized']
                }
            })
        }
    } catch (err) {
        res.status(401).json({
            error: {
                errorMessage: ['Unauthorized']
            }
        })
    }
}