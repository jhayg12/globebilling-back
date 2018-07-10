import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let role = Schema({
    _id: Schema.Types.ObjectId,
    role: {type: String}
});

export default mongoose.model('Roles', role);