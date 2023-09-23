const User = require('../model/authModel');

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