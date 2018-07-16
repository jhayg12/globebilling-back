import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let user = Schema({
    _id: Schema.Types.ObjectId,
    fullname: {type: String, required: true},
    email: {type: String, trim: true, unique: true},
    password: {type: String, required: true},
    role: {type: Schema.Types.ObjectId, ref: 'Role', default: null},
    status: {type: Number, default: 1},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('User', user);