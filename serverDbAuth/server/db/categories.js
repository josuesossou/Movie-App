import { mongoose } from './mongoose';

//movie model
const Category = mongoose.model('categories', {
    category: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    }
});

module.exports = { Category };
