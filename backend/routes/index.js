const authRoutes = require('./authRoutes')
const messengerRoutes = require('./messengerRoutes')
const { authMiddleware } = require('../middleware/authMiddleware')

const route = (app) => {
    app.use('/api/messenger', authRoutes)
    app.use('/api/messenger',authMiddleware, messengerRoutes)
}

module.exports = route