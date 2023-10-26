import Endpoint, {IEndpoint} from '../models/endpointsModel';
import {Types} from 'mongoose';

export const addEndpoint = async (data: IEndpoint) => {
    return Endpoint.create(data);
};

export const deleteEndpoint = async (id: Types.ObjectId) => {
    return Endpoint.deleteOne({_id: id});
}