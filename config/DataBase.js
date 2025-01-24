const mongoose = require('mongoose');

const DBconnection = async(req,res) =>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("db connected successfully");
        
    } catch(error) {
        console.log("DB connetion error");
        
    }
}
module.exports = DBconnection;