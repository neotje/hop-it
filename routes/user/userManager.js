"use strict";

const config = require('config');
const test = config.get('test');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const pug = require('pug');
const mailer = require('nodemailer');
const mongoose = require('mongoose');


// create mail tranporter
if (test) {
    var mailTransport = mailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'neotje111@gmail.com',
            pass: 'paxpndnayqwpdhbu'
        }
    });
} else {
    var mailTransport = mailer.createTransport(config.get('userManager.mailer'));
}


// mail compiler
const compileMail = pug.compileFile('./routes/user/mail.pug');


// connect to database
mongoose.connect(config.get('mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });


var userSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4, required: [true, 'uuid missing']},
    email: { type: String, required: [true, 'email missing'], lowercase: true },
    password: { type: String, required: [true, 'password missing'] },
    firstMessage: { type: String, default: undefined },
    role: { type: String, enum: ['customer', 'admin'], required: [true, 'no role specified'] },
    verify: {
        state: { type: Boolean, default: false },
        token: { type: String, default: uuidv4 },
        date: { type: Date, default: Date.now }
    },
    personal: {
        firstname: { type: String, required: [true, 'firstname missing'] },
        lastname: { type: String, required: [true, 'lastname missing'] },
        gender: { type: String, enum: ['male', 'female', 'other'], required: [true, 'no gender'] }
    },
    date: {
        registration: { type: Date, default: Date.now },
        login: { type: Date, default: Date.now },
        modified: { type: Date, default: Date.now }
    }
});
var User = mongoose.model('User', userSchema);

exports.create = function (email, password, personal, role, callback) {
    var error;

    if (!password || password.trim() == '') {
        error = new Error('Password missing');
        callback(error);
    }

    bcrypt.hash(password, 10, (err, hash) => {
        // check if user exists
        User.find({ email: email }, (err, docs) => {
            if (docs.length) {
                error = new Error('User already exists');
                callback(error);
            } else {
                // create new user model and save to db.
                User.create({
                    email: email,
                    password: hash,
                    personal: personal,
                    role: role
                }, (err, newUser) => {
                    if (err) return callback(err);

                    // send verification mail
                    callback(error, newUser)
                });
            }
        });
    });
}

exports.isUser = function (uuid, callback) {
    User.find({uuid: uuid}, 'length', (err, docs) => {
        if (err) {
            throw err; 
        }
        if (docs.length) {
            callback(true);
        } else {
            callback(false);
        }
    });
}


exports.sendVerification = function (user, callback) {
    var error;

    // generate new verification data.
    user.verify.date = Date.now();
    user.verify.token = uuidv4();

    // save to database.
    user.save();    

    // send mail to user.
    mailTransport.sendMail({
        from: 'neotje111@gmail.com',
        to: user.email,
        subject: 'Please verify your Hop-IT account',
        text: 'Hello world?',
        html: compileMail({
            firstname: user.firstname,
            lastname: user.lastname,
            verificationURL: "http://localhost:3000?token=" + user.verify.token
        })
    }, (err, info) => {
        if (err) return callback(err);
        callback(error);
    });
}

exports.verify = function (token, callback) {
    var error;

    User.findOne({ 'verify.token': token }, (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(new Error('verification token is not valid'));
        if (user.verify.state) return callback(new Error('this account is already verified'))

        user.verify.state = true;
        user.save();
        return callback(error, user);
    });
}

exports.login = function (email, password, callback) {
    User.findOne({ email: email }, (err, user) => {
        if (err) return callback(err);
        if (!user) return callback(new Error('user does not exist'));
        if (!user.verify.state) return callback(new Error('user not verified'));

        bcrypt.compare(password, user.password, (err, res) => {
            if (err) return callback(err);

            if (!res) return callback(new Error('password does not match'))
            if (res) return callback(err, user);
        });
    });
}