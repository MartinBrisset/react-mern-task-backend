const mongoose = require('mongoose')

const configMongo = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    // useFindAndModify: false,
    // useCreateIndex: true 
};

mongoose.connect(process.env.DB_MONGO, configMongo,  (err, res) => {
    if(err) throw err;
    console.log('BD conectada');
})