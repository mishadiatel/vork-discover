import mongoose from 'mongoose';
import {ReviewDocument} from './reviewModel';

const validator = require('validator');

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    role: string;
    password: string;
    passwordConfirm: string;
}

export interface UserDocument extends IUser, mongoose.Document {
    fullName: string;
    reviews: ReviewDocument[];
    passwordChangedAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: string;
    createdAt: Date;
    isActive: boolean;
}


const userSchema = new mongoose.Schema({
        firstName: {
            type: String,
            required: [true, 'Every user should have a first name']
        },
        lastName: {
            type: String,
            required: [true, 'Every user should have a last name']
        },
        email: {
            type: String,
            required: [true, 'Every user should have an email'],
            validate: [validator.isEmail, 'You provided not valid email'],
            lowercase: true
        },
        photo: String,
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm a password'],
            validate: {
                validator: function (this: UserDocument, el: string): boolean {

                    return el === this.password;
                },
                message: 'Passwords are not the same'
            }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        isActive: {
            type: Boolean,
            default: false,
            select: false
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }
    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    });

userSchema.virtual('fullName').get(function (this: UserDocument) {
    return `${this.firstName} ${this.lastName}`;
});

userSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'user',
    localField: '_id'
});


const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
