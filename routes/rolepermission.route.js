import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Role from '../models/role.model';
import Permission from '../models/permission.model';

const router = express.Router();

router.route('/roles/permissions/add/:id').post((req, res) => {
    
    var permId = new mongoose.Types.ObjectId(req.body.permId);
    
    Role.findOne({_id: req.params.id}, (err, role) => {
        if (err) {
            return res.json('Role Not Exists!');
        } 

        Role.update({_id: req.params.id}, {$addToSet: {permission: permId}}, (err, role) => {
            if (role.nModified === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Permission already exists!'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'New Permission was successfully added!'
            });

        });

    });

});

router.route('/roles/permissions/update/:id').post((req, res) => {
    
    var permId = new mongoose.Types.ObjectId(req.body.permId);
    var newPermId = new mongoose.Types.ObjectId(req.body.newPermId);
    
    Role.findOne({_id: req.params.id}, (err, role) => {
        if (err) {
            return res.json('Not Exists!');
        } 

        Role.update({_id: req.params.id, permission: permId}, {$set: {'permission.$': newPermId}}, (err, role) => {
            if (role.nModified === 0) {
                return res.status(500).json({
                    success: false,
                    message: 'Error Updating!'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Role permission was successfully updated!'
            });

        });

    });

});

router.route('/roles/permissions/delete/:id').post((req, res) => {
    Role.findById(req.params.id, (err, role) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Role does not exists!'
            });
        }

        Role.update({_id: req.params.id, permission: req.body.permId}, {$pull: {permission: req.body.permId}}, {multi: true}, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error deletion'
                });
            }

            if (result) {
                return res.status(200).json({
                    success: true,
                    message: 'Permission was successfully deleted!'
                });
            }

        });

    });
})

router.route('/roles/permissions/:id').get((req, res) => {
    Role.findOne({_id: req.params.id}, (err, perms) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error Listing!'
            });
        }

        return res.status(200).json(perms);
    }).populate({path: 'permission', select: 'permissionName'});
});

module.exports = router;