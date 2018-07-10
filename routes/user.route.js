import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pwdGen from 'generate-password';
import User from '../models/user.model';
import Role from '../models/role.model';

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
    }).populate({path: 'role', select: 'role'});
});

router.route('/auth/signup').post((req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            res.status(500).json({
                error: err
            });
        } else {
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                fullname: req.body.fullName,
                role: new mongoose.Types.ObjectId(),
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    const JWTToken = jwt.sign({
                        email: user.email,
                        _id: user.id
                    },
                    'secret', {
                        expiresIn: 60 * 5
                    });
                    res.status(200).json({
                        success: true,
                        data: {
                            userData: result,
                            token: JWTToken
                        },
                        message: 'New User has been created!'
                    });
                })
                .catch(error => {
                    res.status(500).json({
                        error: error.message
                    });
                });
        }
    });

});

router.route('/auth/signin').post((req, res) => {
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {
            bcrypt.compare(req.body.password, user.password, (error, result) => {
                // If Password does not match
                if (error) {
                    res.status(401).json({
                        success: false,
                        message: 'Unauthorized Access!'
                    });
                }
                if (result) {
                    const JWTToken = jwt.sign({
                            email: user.email,
                            _id: user.id
                        },
                        'secret', {
                            expiresIn: 60 * 5
                        });
                    return res.status(200).json({
                        success: true,
                        data: {
                            email: user.email,
                            token: JWTToken
                        }
                    });
                }

                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized Access!'
                });
            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: 'Email Address does not exist!'
            });
        });
});

router.route('/auth/forgot-password').post((req, res) => {
    User.findOne({
            email: req.body.email
        })
        .exec()
        .then(user => {

            const newPwd = pwdGen.generate({
                length: 10,
                numbers: true
            });

            bcrypt.hash(newPwd, 10, (err, hash) => {
                
                user.password = hash;

                const msg = {
                    to: 'jhayg12@gmail.com',
                    from: 'jayson@iscale-solutions.com',
                    subject: 'Globe Billing - Reset Password',
                    template_id: '3fd0363e-237d-4f68-a1f0-d8602d0676b0',
                    substitutionWrappers: ['{{', '}}'],
                    substitutions: {
                        name: user.fullname,
                        password: newPwd
                    },
                };

                sgMail.send(msg);

                user.save()
                    .then(() => {
                        return res.status(200).json({
                            success: true,
                            data: {
                                email: user.email,
                                password: newPwd
                            }
                        });

                    })
                    .catch(() => {
                        res.status(500).json({Error:'Update Failed!'});
                    });

            });
        })
        .catch(error => {
            res.status(500).json({
                success: false,
                message: 'Email Address does not exist!'
            });
        });
        
    User.findById(req.params.id, (err, user) => {

    });
});

module.exports = router;