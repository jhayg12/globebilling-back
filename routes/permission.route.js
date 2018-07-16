import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Role from '../models/role.model';
import Permission from '../models/permission.model';

const router = express.Router();

router.route('/permissions').get((req, res) => {
    Permission.find((err, perms) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error Listing'
            });
        } 
                
        return res.status(200).json(perms);

    });
});

router.route('/permissions/add').post((req, res) => {

    Permission.find({permissionName: req.body.permName}, (err, perm) => {
        
        if (perm.length > 0) {
            return res.status(401).json({
                success: false,
                message: 'Permission already exists!'
            });
        }

        const newPerm = new Permission({
            _id: new mongoose.Types.ObjectId,
            permissionName: req.body.permName
        });

        newPerm.save()
            .then(newPerm => {
                return res.status(200).json({
                    success: true,
                    message: 'New Permission was successfully added!'
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: 'Error Adding Permission!'
                });
            });

    });

});

router.route('/permissions/update/:id').post((req, res) => {
    Permission.findById(req.params.id, (err, perm) => {
        if (!perm) {
            return res.status(401).json({
                success: false,
                message: 'Permission does not exists!'
            });
        }

        perm.permissionName = req.body.newPermName;

        perm.save()
            .then(perm => {
                return res.status(200).json({
                    success: true,
                    message: 'Permission was successfully updated!'
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: 'Error Updating!'
                })
            });

    });
});

router.route('/permissions/delete/:id').get((req, res) => {

    Permission.findByIdAndRemove({_id: req.params.id}, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error Permission deletion'
            });
        }

        if (result) {
            Role.update({permission: req.params.id}, {$pull: {permission: req.params.id}}, {multi: true}, (err, role) => {
                if (role.nModified > 0) {
                    return res.status(200).json({
                        success: true,
                        message: 'Permission was successfully deleted!'
                    });
                }
            });

            return res.status(200).json({
                success: true,
                message: 'Permission was successfully deleted!'
            });

        }

    });
});

module.exports = router;