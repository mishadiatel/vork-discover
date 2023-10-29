import mongoose, {Schema, Types} from 'mongoose';
import Review, {ReviewDocument} from './reviewModel';
import {NextFunction} from 'express';

export interface IVacancy {
    position: string,
    company: Types.ObjectId,
    recruiter: Types.ObjectId,
    endpoints: Array<Types.ObjectId>,
    description: string,

}

export interface VacancyDocument extends IVacancy, mongoose.Document {
    active: boolean;
    // reviews: ReviewDocument[];
    createdAt: Date,
    numberReviews: number,
}

const vacancySchema = new Schema({
        position: {
            type: String,
            required: [true, 'Every vacancy should have a position']
        },
        description: String,
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company'
        },
        recruiter: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        endpoints: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Endpoint'
            }
        ],
        active: {
            type: Boolean,
            default: true
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

vacancySchema.pre(/^find/, function (this: VacancyDocument, next) {
    this.populate('endpoints');
    this.populate('recruiter');
    this.populate('company');
    next();
});

vacancySchema.virtual('numberReviews', {
    ref: 'Review',
    foreignField: 'vacancy',
    localField: '_id',
    count: true
});

vacancySchema.pre(/^find/, function (this: VacancyDocument, next) {
    this.populate('numberReviews');
    next();
})

const Vacancy = mongoose.model<VacancyDocument>('Vacancy', vacancySchema);

export default Vacancy;