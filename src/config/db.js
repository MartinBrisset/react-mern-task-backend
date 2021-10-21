const mongoose = require('mongoose')
require('dotenv').config({ path: 'vars.env'})

const configMongo = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true 
};

console.log(DB_MONGO)
return

mongoose.connect(process.env.DATABASE, configMongo, (err, res) => {
    if(err) throw err;
    console.log('BD conectada');
})