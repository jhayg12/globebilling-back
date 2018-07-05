import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Users = new Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: [
        { type: Schema.Types.ObjectId, ref: 'Roles' }
    ],
    status: {
        type: Number
    }
});

export default mongoose.model('Users', Users);