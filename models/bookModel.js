var mongoose = require ("mongoose");
var Schema = mongoose.Schema;



var BookSchema = new Schema({
    title:{
        type: String
    },
    author:{
        type: String
    },
    pages:{
        type: String
    },
});

module.exports = mongoose.model("Book", BookSchema);
