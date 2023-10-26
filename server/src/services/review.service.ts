import Review, {IReview} from '../models/reviewModel';
import {Types} from 'mongoose';

export const addReview = async (data: IReview) => {
    return Review.create(data);
};
export const deleteReview = async (id: Types.ObjectId) => {
    return Review.deleteOne({_id: id});
};