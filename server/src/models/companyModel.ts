import mongoose, {Schema} from 'mongoose';

const validator = require('validator');

export interface ICompany {
    name: string,
    address: string,
    additionalInfo?: string,
    numberWorkers: number,
    photo?: string,
    website?: string,
}

export interface CompanyDocument extends ICompany, mongoose.Document {

}

const companySchema = new Schema({
        name: {
            type: String
        },
        address: {
            type: String,
            validate: [validator.isURL, 'Address should be a google map link']
        },
        additionalInfo: String,
        numberWorkers: Number,
        photo: String,
        website: {
            type: String
        }

    },
    {
        toJSON: {virtuals: true},
        toObject: {virtuals: true}
    }
);

companySchema.virtual('vacancies', {
    ref: 'Vacancy',
    foreignField: 'company',
    localField: '_id'
});

const Company = mongoose.model<CompanyDocument>('Company', companySchema);
export default Company;