import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let permission = Schema({
    _id: { type: Schema.Types.ObjectId },
    permissionName: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

export default mongoose.model('Permission', permission);