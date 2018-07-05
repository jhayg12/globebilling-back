import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Users from './models/users';
import Roles from './models/roles';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/globebilling");

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB is Running!');
});

router.route('/users').get((req, res) => {
    Users.find((err, users) => {
        if (err) {
            res.status(400).json(err);
        }
        else {
            res.status(200).json(users);
        }
    }).populate({ path: 'role', select: 'role' });
    
});

app.use('/', router);
app.listen(4000, () => console.log('Express is Running! on port 4000'));