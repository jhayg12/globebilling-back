import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import user from './routes/user.route';
import cors from 'cors';

const app = express();

mongoose.connect('mongodb://localhost:27017/globebilling');

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB is Running on port 27017!');
});

const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/globebilling', user);

// Express
app.listen(PORT, function(){
   console.log('Server is running on Port', PORT);
});