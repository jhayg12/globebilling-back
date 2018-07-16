import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let role = Schema({
    _id: Schema.Types.ObjectId,
    roleName: {type: String},
    permission: [{type: Schema.Types.ObjectId, ref: 'Permission', default: []}],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('Role', role);