const express = require('express');
const app = express(); 

const PORT = process.env.PORT || 5000 ;

app.get('/', (req, res) => {
    res.send('this is message from server');
})

app.listen(PORT, () => {
    console.log('sever run with port ' + PORT)
})