import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let user = Schema({
    _id: Schema.Types.ObjectId,
    fullname: {type: String, required: true},
    email: {type: String, trim: true, unique: true},
    password: {type: String, required: true},
    role: {type: Schema.Types.ObjectId, ref: 'Roles'},
    status: {type: Number, default: 1}
});

export default mongoose.model('User', user);