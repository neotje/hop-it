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
mongoose.connect(config.get('userManager.mongodb'), { useNewUrlParser: true, autoIndex: false, useUnifiedTopology: true });


var userSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    email: { type: String, required: [true, 'email missing'], lowercase: true },
    password: { type: String, required: [true, 'password missing'] },
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


exports.create = function (email, password, personal, callback) {
    if (password.trim() == '') {
        callback(new Error('Password empty'));
    }

    bcrypt.hash(password, 10, (err, hash) => {
        // check if user exists
        User.find({ email: email }, (err, docs) => {
            if (docs.length) {
                callback(new Error('User already exists'));
            } else {
                // create new user model and save to db.
                User.create({
                    email: email,
                    password: hash,
                    personal: personal
                }, (err, newUser) => {
                    if (err) return callback(err);

                    // send verification mail
                    exports.sendVerification(newUser, callback);
                });
            }
        });
    });
}


exports.sendVerification = function (user, callback) {
    // generate new verification data.
    user.verify.date = Date.now();
    user.verify.token = uuidv4();

    // save to database.
    user.save();

    // send mail to user.
    mailTransport.sendMail({
        from: user.email,
        to: 'neotje111@gmail.com',
        subject: 'Please verify your Hop-IT account',
        text: 'Hello world?',
        html: compileMail({
            firstname: user.firstname,
            lastname: user.lastname,
            verificationURL: "localhost:3000/user/verify?token=" + user.verify.token
        })
    }, (err, info) => {
        if (err) return callback(err);
        callback();
    });
}

console.log(new Date());



exports.create('neotje111@gmail.com', 'test12345', { firstname: 'neo', lastname: 'hop', gender: 'male' }, (r) => {
    console.log(r);

});
