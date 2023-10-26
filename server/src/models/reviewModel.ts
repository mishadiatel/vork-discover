import mongoose, {Schema, Types} from 'mongoose';

export interface IReview {
    vacancy: Types.ObjectId,
    user: Types.ObjectId,
    aboutMe: string,
    resume: string,
}

export interface ReviewDocument extends IReview, mongoose.Document {
    createdAt: Date,
}

const reviewSchema = new Schema({
    vacancy: {
        type: Schema.Types.ObjectId,
        ref: 'Vacancy',
        required: [true, 'Every review must have a vacancy']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Every review must have a user who written that review']
    },
    aboutMe: {
        type: String,
        required: [true, 'Every review must have a little story about you']
    },
    resume: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

const Review = mongoose.model<ReviewDocument>('Review', reviewSchema);

export default Review;