import {Types} from 'mongoose';
import Vacancy, {IVacancy} from '../models/vacancyModel';

export const getVacancyById = (id: Types.ObjectId) => {
    return Vacancy.findById(id);
};

export const getAllVacancies = () => {
    return Vacancy.find();
};

export const updateVacancy = (id: Types.ObjectId, vacancyData: Partial<IVacancy>) => {
    return Vacancy.findByIdAndUpdate(id, vacancyData);
};

export const blockVacancy = async (id: Types.ObjectId) => {
    return updateVacancy(id, {active: false});
};

export const deleteVacancy = async (id: Types.ObjectId) => {
    return Vacancy.deleteOne({_id: id});
};