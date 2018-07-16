import express from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Role from '../models/role.model';
import Permission from '../models/permission.model';

const router = express.Router();

router.route('/roles').get((req, res) => {
    Role.find((err, roles) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error Listing'
            });
        } 
                
        return res.status(200).json(roles);

    }).populate({path: 'permission', select: 'permissionName'});
});

router.route('/roles/add').post((req, res) => {

    Role.find({roleName: req.body.roleName}, (err, role) => {
        
        if (role.length > 0) {
            return res.status(401).json({
                success: false,
                message: 'Role already exists!'
            });
        }

        const newRole = new Role({
            _id: new mongoose.Types.ObjectId,
            roleName: req.body.roleName,
            permission: []
        });

        newRole.save()
            .then(newRole => {
                return res.status(200).json({
                    success: true,
                    message: 'New Role was successfully added!'
                });
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    message: 'Error Adding Role!'
                });
            });

    });

});

router.route('/roles/update/:id').post((req, res) => {
    Role.findById(req.params.id, (err, role) => {
        if (!role) {
            return res.status(401).json({
                success: false,
                message: 'Role does not exists!'
            });
        }

        role.roleName = req.body.roleName;
        role.permission = [];

        role.save()
            .then(role => {
                return res.status(200).json({
                    success: true,
                    message: 'Role was successfully updated!'
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

router.route('/roles/delete/:id').get((req, res) => {
    Role.findByIdAndRemove({_id: req.params.id}, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Error Role deletion'
            });
        }

        if (result) {
            User.findOne({role: req.params.id}, (err, user) => {
                if (user) {
                    user.role = null;
    
                    user.save()
                        .then(user => {
                            return res.status(200).json({
                                success: true,
                                message: 'Role was deleted to User' + user.fullname
                            });
                        })
                }
            });
    
            return res.status(200).json({
                success: true,
                message: 'Role was successfully deleted!'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Role does not exists!'
        });

    });
});

module.exports = router;