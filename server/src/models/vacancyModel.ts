import mongoose, {Schema, Types} from 'mongoose';
import {ReviewDocument} from './reviewModel';

export interface IVacancy {
    position: string,
    company: Types.ObjectId,
    endpoints: Array<Types.ObjectId>,
    active: boolean
}

export interface VacancyDocument extends IVacancy, mongoose.Document {
    reviews: ReviewDocument[];
    createdAt: Date,
}

const vacancySchema = new Schema({
        position: {
            type: String,
            required: [true, 'Every vacancy should have a position']
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: 'Company'
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
    next();
});

vacancySchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'vacancy',
    localField: '_id'

});

const Vacancy = mongoose.model<VacancyDocument>('Vacancy', vacancySchema);

export default Vacancy;