const mongoose = require('mongoose');

const useSchema = new mongoose.Schema({
   name: {type : String, required: true, trim : true},
   email: {type : String, required: true, trim : true},
   password: {type : String, required: true, trim : true},
   tc: {type : Boolean, required: true},
})

const userModel = mongoose.model('user', useSchema);

module.exports = userModel;