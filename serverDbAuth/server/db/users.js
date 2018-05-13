import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import validator from 'validator';
import _ from 'lodash';

///Creating a user schema
const UserSchema = new mongoose.Schema({
    user_name: {
        type: String,
        trim: true,
        require: true,
        minlength: 1,
        unique: true,
        // validate: {
        //     validator: validator.isEmail,
        //     message: '{VALUE} is not a valid email'
        // }
    },
    password: {
        type: String,
        trim: true,
        minlength: 6,
        require: true
    },
    tokens: [{
        access: {
            type: String,
            require: true
        },
        token: {
            type: String,
            require: true
        }
    }]
});

//makes sure any returned user object only have the user id and email
UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'user_name']);
};

/* eslint-disable no-underscore-dangle*/
/*generating a token using jwt(json web tokens) 
and saving them with the user object into the database*/
UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id, access }, 'secret');

    user.tokens.push({ access, token });

    return user.save().then(() => token);
};

///finding a token and removing it from the tokens object of the particular user's object
UserSchema.methods.removeToken = function (token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: { token }
        }
    });
};


///getting a user from the database using the token
UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decode;
             
    try {
        decode = jwt.verify(token, 'secret');
    } catch (e) {
        throw new Error('error from model');
    }
    return User.findOne({
        _id: decode._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

///find user object using email and checking the password at login
UserSchema.statics.findByCredential = function (userName, password) {
    const User = this;

    return User.findOne({ user_name: userName }).then(user => {
        if (!user) return Promise.reject('second err');

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) return reject('second err');

                if (res === true) {
                    resolve(user);
                } else {
                    reject('third err');
                }
            });
        });
    });
};

/*
 mongoose middleware that will run after a user sign up 
for the first time and encrypting the user's password
*/
UserSchema.pre('save', function (next) {
    const user = this;
    
    if (user.isModified('password')) {
        bcrypt.genSalt(15, (err, salt) => {
            bcrypt.hash(user.password, salt, (error, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});


const User = mongoose.model('User', UserSchema);

module.exports = { User };
