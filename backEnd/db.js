const mongoose = require('mongoose')

const MONGOURI = "mongodb+srv://username:password@cluster0.oylio.mongodb.net/iNoteBook?retryWrites=true&w=majority"


const connectMongoDB = () => {
    mongoose.connect(MONGOURI, ()=>{
        console.log("MongoDB Connected");
    })
}

module.exports = connectMongoDB;
