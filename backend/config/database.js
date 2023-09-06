const mongooose = require('mongoose')
const databaseConnect = () => {
    mongooose.connect(process.env.DATABASE_URL)
        .then(()=> {
            console.log('databae connected successfully')
        })
        .catch(err => {
            console.log(err)
        }) 
}  

module.exports =  databaseConnect