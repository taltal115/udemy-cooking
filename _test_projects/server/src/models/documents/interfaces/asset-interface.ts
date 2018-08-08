import { Document } from 'mongoose';

export interface IAsset extends Document {
    orgId: string,
    name: string,
    categories: [string],
    genres: [string],
    tags: [string],
    isEdit?: boolean
};