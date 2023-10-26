import Company, {ICompany} from '../models/companyModel';
import {Types} from 'mongoose';

export const addCompany = async (data: ICompany) => {
    return Company.create(data);
};

export const updateCompany = async (id: Types.ObjectId, data: Partial<ICompany>) => {
    return Company.findByIdAndUpdate(id, data);
};

export const deleteCompany = async (id: Types.ObjectId) => {
    return Company.deleteOne({_id: id});
};

export const gerCompany = async (id: Types.ObjectId) => {
    return Company.findById(id);

};

export const getAllCompanies = async () => {
    return Company.find();
};