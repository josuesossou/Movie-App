import mongoose from 'mongoose';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/movieapp').catch(() => {
    console.log('cant connect to database');
});

module.exports = { mongoose };
