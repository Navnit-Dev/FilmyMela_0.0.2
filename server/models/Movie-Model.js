const { Schema, model } = require('mongoose');

const MovieSchema = new Schema({
    title: String,
    posterUrl:String,
    description: String,
    category:[String],
    rating: { type: Number, required: true },
    screenshots: [String],
    downloadLinks: {
        type: Map,
        of: String
    },
    industry: String,
    actors: [String],
    languages: [String],
    position: {type:String,required:true },
    watch:String,
    sequence: {type:Number,default:0},
    year:{type:Date,required:false}
});

const Movie = model('Movie', MovieSchema);
module.exports = Movie;