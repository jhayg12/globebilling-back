import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pwdGen from 'generate-password';
import dotEnv from 'dotenv';
import User from '../models/user.model';
import Role from '../models/role.model';

// Load Environment Variables
dotEnv.load();

// Send Grid
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

router.route('/users').get((req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(500).json({error:err});
        } else {
            return res.status(200).json(users);
        }
    }).populate({path: 'role', select: 'roleName'});
});

router.route('/users/add').post((req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                fullname: req.body.fullName,
                role: new mongoose.Types.ObjectId(req.body.role),
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    return res.status(200).json({
                        success: true,
                        message: 'New User has been created!'
                    });
                })
                .catch(error => {
                    return res.status(500).json({
                        error: error.message
                    });
                });
        }
    });

});


router.route('/auth/signup').post((req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                fullname: req.body.fullName,
                role: new mongoose.Types.ObjectId('5b4d8267a83b1d4ff53f55d9'), // Viewer Default
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    User.findOne({email: user.email}, (err, userData) => {
                        if (result) {
                            const JWTToken = jwt.sign({
                                email: userData.email,
                                username: userData.username,
                                fullname: userData.fullname,
                                role: userData.role,
                                _id: userData.id
                            },
                            process.env.API_SECRET_KEY, {
                                expiresIn: 60 * 15
                            });
                            return res.status(200).json({
                                success: true,
                                data: {
                                    userData: result,
                                    token: JWTToken
                                },
                                message: 'New User has been created!'
                            });
                        }
                    }).populate({path: 'role', select: 'roleName'});
                })
                .catch(error => {
                    return res.status(500).json({
                        error: error.message
                    });
                });
        }
    });

});

router.route('/auth/signin').post((req, res) => {    
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'Email Address does not exist!'
            });
        }

        bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (!result) {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect Password!'
                });
            }

            const JWTToken = jwt.sign({
                    email: user.email,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role,
                    _id: user.id
                },
                    process.env.API_SECRET_KEY, {
                    expiresIn: 60 * 15
                }
            );

            return res.status(200).json({
                success: true,
                data: {
                    email: user.email,
                    token: JWTToken
                }
            });

        });

    }).populate({path:'role', select:'roleName'});

});

router.route('/auth/forgot-password').post((req, res) => {        
    User.findOne({email: req.body.email}, (err, user) => {
        if (!user) {
            return res.status(500).json({
                success: false,
                message: 'Email Address does not exist'
            });
        }
        const newPwd = pwdGen.generate({
            length: 10,
            numbers: true
        });

        bcrypt.hash(newPwd, 10, (err, hash) => {

            user.password = hash;

            const msg = {
                to: user.email,
                from: 'jayson@iscale-solutions.com',
                subject: 'Globe Billing - Reset Password',
                template_id: '3fd0363e-237d-4f68-a1f0-d8602d0676b0',
                substitutionWrappers: ['{{', '}}'],
                substitutions: {
                    name: user.fullname,
                    password: newPwd
                }
            }

            sgMail.send(msg);

            user.save()
                .then(user => {
                    return res.status(200).json({
                        success: true,
                        email: user.email,
                        password: newPwd
                    });

                })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        message: 'Cannot Update Password!'
                    });
                });

            });
        
    });
});

module.exports = router;