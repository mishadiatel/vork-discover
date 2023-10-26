import User, {IUser} from '../models/userModel';
import {Types} from 'mongoose';

export const createUser = async (input: IUser) => {
    return User.create(input);
};

export const updateUser = async (id: Types.ObjectId, input: Partial<IUser>) => {
    return User.findByIdAndUpdate(id, input);
};

export const deleteUser = async (id: Types.ObjectId) => {
    return User.deleteOne({_id: id});
};

export const getUser = async (id: Types.ObjectId) => {
    return User.findById(id);
};

export const getAllUsers = async () => {
    return User.find();
}