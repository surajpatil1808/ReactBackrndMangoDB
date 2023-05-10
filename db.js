

const mongoose = require('mongoose');
// const { default: mongoose } = require('mongoose');
const mongoURI= "mongodb://localhost:27017/inotebook?readPreference=primary&appname=MongoDB+Compass&directConnection=true&ssl=false"

const connectToMongo=()=>
{
    // mongoose.connect(mongoURI, ()=>{
    //     console.log("connect to mango success");
    // })
            
            
    mongoose.connect(mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('Connected to MongoDB!');
      })
      .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
      });



}

module.exports = connectToMongo;