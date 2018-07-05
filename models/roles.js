import mongoose from 'mongoose';

const Schema  = mongoose.Schema;

let Roles = Schema({
    _id: {
        type: Schema.Types.ObjectId
    },
    role: {
        type: String
    }
});

export default mongoose.model('Roles', Roles);