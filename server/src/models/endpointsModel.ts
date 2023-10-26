import mongoose, {Schema} from 'mongoose';

export interface IEndpoint {
    topic: string,
    endpoint: string
}

export interface EndpointDocument extends IEndpoint, mongoose.Document {

}

const endpointSchema = new Schema({
    topic: {
        type: String,
        enum: ['skill', 'location', 'experience', 'salary', 'employment'],
        required: [true, 'Every endpoint must have a topic']
    },
    endpoint: {
        type: String,
        required: [true, 'Every endpoint must have some value']
    }
});

const Endpoint = mongoose.model<EndpointDocument>('Endpoint', endpointSchema);
export default Endpoint;