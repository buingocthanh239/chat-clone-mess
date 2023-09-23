const express = require('express');
const app = express(); 
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const databaseConnect = require('./config/database')
const route = require('./routes')
const cors = require('cors')


dotenv.config({
    path: 'backend/config/config.env'
})

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
    express.urlencoded({
        extended: true,
    }),
);

databaseConnect();
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))
route(app);

app.get('/', (req, res) => {
    res.send('this is message from server');
})

const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
    console.log('sever run with port ' + PORT)
})