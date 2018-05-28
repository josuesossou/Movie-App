import { mongoose } from './mongoose';

//movie model
const Movie = mongoose.model('Movie', {
    url_video: {
        type: String,
        required: true,
        trim: true,
    },
    url_thumbnail: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = { Movie };
