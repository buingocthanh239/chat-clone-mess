const authRoutes = require('./authRoutes')
const messengerRoutes = require('./messengerRoutes')

const route = (app) => {
    app.use('/api/messenger', authRoutes)
    app.use('/api/messenger', messengerRoutes)
}

module.exports = route