const User = require('../models/user');
const express = require('express');
const fs = require('fs');
const path = require('path');



module.exports.profile = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });

}
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }



    return res.render('user_sign_up', {
        title: "Edgistify | Sign Up"
    })
}
module.exports.signIn = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Edgistify | Sign In"
    })
}
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('error in finding user in signing up'); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('error in creating user while signing up'); return }

                return res.redirect('/users/sign-in');
            })
        } else {
            return res.redirect('back');
        }

    });
}
module.exports.createSession = function (req, res) {

    req.flash('Success', 'Logged In successfully');
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {

    req.logout();
    req.flash('Success', 'Logged Out successfully');
    return res.redirect('/');
}
module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log('******MULTER Error', err);
                }
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                // TO Be Fixed

                if (req.file) {
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });

        }
        catch (err) {
            req.flash('error', err);
            return res.redirect('back');
        }
    }
    else {
        req.flash('error', Unauthorised);
        return res.status(401).send('Unauthorised');
    }
}

