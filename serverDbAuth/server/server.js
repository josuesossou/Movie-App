import express from 'express';
import mongoose from 'mongoose';

const app = express();
const port = 3000;

mongoose.connect('');

app.get('/', (req, res) => {
    res.send('hello World');
});

app.listen(port, () => {
     console.log(`Server running on port ${port}`);
});
