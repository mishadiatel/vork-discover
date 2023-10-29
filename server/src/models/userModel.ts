import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import {ReviewDocument} from './reviewModel';
import {VacancyDocument} from './vacancyModel';

const validator = require('validator');

export interface IUser {
    firstName: string;
    lastName: string;
    email: string;
    photo?: string;
    role: 'user' | 'hr' | 'admin';
    password: string;
    passwordConfirm: string | undefined;
}

export interface UserDocument extends IUser, mongoose.Document {
    fullName: string;
    reviews: ReviewDocument[];
    recruiterVacancies: VacancyDocument[];
    passwordChangedAt: Date;
    passwordResetToken?: string;
    passwordResetExpires?: number;
    createdAt: Date;
    correctPassword: (candidatePassword: string, userPassword: string) => Promise<boolean>;
    changedPasswordAfter: (JWTTimestamp: number) => boolean;
    createPasswordResetToken: () => string
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
            lowercase: true,
            unique: true
        },
        photo: String,
        role: {
            type: String,
            enum: ['user', 'hr', 'admin'],
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

userSchema.virtual('recruiterVacancies', {
    ref: 'Vacancy',
    foreignField: 'recruiter',
    localField: '_id'
});

userSchema.pre('save', async function (this: UserDocument, next) {
    if (!this.isModified('password')) return next();
    // @ts-ignore
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();

});

userSchema.pre('save', function (this: UserDocument, next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.pre('save', async function (this: UserDocument, next) {
    this.photo = this.photo || `https://ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword: string, userPassword: string) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (this: UserDocument, JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(String(new Date(this.passwordChangedAt).getTime() / 1000), 10);
        return JWTTimestamp < changedTimestamp;
    }

    return false;
};

userSchema.methods.createPasswordResetToken = function(this: UserDocument) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};


const User = mongoose.model<UserDocument>('User', userSchema);

export default User;
