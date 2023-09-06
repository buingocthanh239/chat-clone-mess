const authRoutes = require('./authRoutes')
const route = (app) => {
    app.use('/api/messenger', authRoutes)
}

module.exports = route